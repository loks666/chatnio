package utils

import (
	"bytes"
	"chat/globals"
	"crypto/tls"
	"fmt"
	"github.com/goccy/go-json"
	"github.com/spf13/viper"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func Http(uri string, method string, ptr interface{}, headers map[string]string, body io.Reader) (err error) {
	req, err := http.NewRequest(method, uri, body)
	if err != nil {
		return err
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if err = json.NewDecoder(resp.Body).Decode(ptr); err != nil {
		return err
	}
	return nil
}

func HttpRaw(uri string, method string, headers map[string]string, body io.Reader) (data []byte, err error) {
	req, err := http.NewRequest(method, uri, body)
	if err != nil {
		return nil, err
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if data, err = io.ReadAll(resp.Body); err != nil {
		return nil, err
	}
	return data, nil
}

func Get(uri string, headers map[string]string) (data interface{}, err error) {
	err = Http(uri, http.MethodGet, &data, headers, nil)
	return data, err
}

func GetRaw(uri string, headers map[string]string) (data string, err error) {
	buffer, err := HttpRaw(uri, http.MethodGet, headers, nil)
	if err != nil {
		return "", err
	}
	return string(buffer), nil
}

func Post(uri string, headers map[string]string, body interface{}) (data interface{}, err error) {
	err = Http(uri, http.MethodPost, &data, headers, ConvertBody(body))
	return data, err
}

func ConvertBody(body interface{}) (form io.Reader) {
	if buffer, err := json.Marshal(body); err == nil {
		form = bytes.NewBuffer(buffer)
	}
	return form
}

func PostForm(uri string, body map[string]interface{}) (data map[string]interface{}, err error) {
	client := &http.Client{}
	form := make(url.Values)
	for key, value := range body {
		form[key] = []string{value.(string)}
	}
	res, err := client.PostForm(uri, form)
	if err != nil {
		return nil, err
	}
	content, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	if err = json.Unmarshal(content, &data); err != nil {
		return nil, err
	}

	return data, nil
}

func EventSource(method string, uri string, headers map[string]string, body interface{}, callback func(string) error) error {
	// panic recovery
	defer func() {
		if err := recover(); err != nil {
			globals.Warn(fmt.Sprintf("event source panic: %s (uri: %s, method: %s)", err, uri, method))
		}
	}()

	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	client := &http.Client{}
	req, err := http.NewRequest(method, uri, ConvertBody(body))
	if err != nil {
		return nil
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	res, err := client.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.StatusCode >= 400 {
		// print body
		if viper.GetBool("debug") {
			if content, err := io.ReadAll(res.Body); err == nil {
				fmt.Println(fmt.Sprintf("request failed with status: %s, body: %s", res.Status, string(content)))
			}
		}

		return fmt.Errorf("request failed with status: %s", res.Status)
	}

	for {
		buf := make([]byte, 20480)
		n, err := res.Body.Read(buf)

		if err == io.EOF {
			return nil
		} else if err != nil {
			return err
		}

		data := string(buf[:n])
		for _, item := range strings.Split(data, "\n") {
			segment := strings.TrimSpace(item)
			if len(segment) > 0 {
				if err := callback(segment); err != nil {
					return err
				}
			}
		}
	}
}
