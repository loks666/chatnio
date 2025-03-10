import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input.tsx";
import {
  ChevronLeft,
  ChevronRight,
  Link,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { login, modelAvatars, supportModels } from "@/conf.ts";
import { splitList } from "@/utils/base.ts";
import { Model } from "@/api/types.ts";
import { useDispatch, useSelector } from "react-redux";
import {
  addModelList,
  closeMarket,
  getPlanModels,
  removeModelList,
  selectModel,
  selectModelList,
  setModel,
} from "@/store/chat.ts";
import { Button } from "@/components/ui/button.tsx";
import { levelSelector } from "@/store/subscription.ts";
import { teenagerSelector } from "@/store/package.ts";
import { ToastAction } from "@/components/ui/toast.tsx";
import { selectAuthenticated } from "@/store/auth.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import { docsEndpoint } from "@/utils/env.ts";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className={`search-bar`}>
      <Search size={16} className={`search-icon`} />
      <Input
        placeholder={t("market.search")}
        className={`rounded-full input-box`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <X
        size={16}
        className={`clear-icon ${value.length > 0 ? "active" : ""}`}
        onClick={() => onChange("")}
      />
    </div>
  );
}

type ModelProps = {
  model: Model;
  className?: string;
  style?: React.CSSProperties;
};

function ModelItem({ model, className, style }: ModelProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const list = useSelector(selectModelList);
  const current = useSelector(selectModel);

  const level = useSelector(levelSelector);
  const student = useSelector(teenagerSelector);
  const auth = useSelector(selectAuthenticated);

  const state = useMemo(() => {
    if (current === model.id) return 0;
    if (list.includes(model.id)) return 1;
    return 2;
  }, [model, current, list]);

  const pro = useMemo(() => {
    return getPlanModels(level).includes(model.id);
  }, [model, level, student]);

  const avatar = useMemo(() => {
    const source = modelAvatars[model.id] || modelAvatars[supportModels[0].id];
    return `/icons/${source}`;
  }, [model]);

  return (
    <div
      className={`model-item ${className}`}
      style={style}
      onClick={() => {
        dispatch(addModelList(model.id));

        if (!auth && model.auth) {
          toast({
            title: t("login-require"),
            action: (
              <ToastAction altText={t("login")} onClick={login}>
                {t("login")}
              </ToastAction>
            ),
          });
          return;
        }

        dispatch(setModel(model.id));
        dispatch(closeMarket());
      }}
    >
      <img className={`model-avatar`} src={avatar} alt={model.name} />
      <div className={`model-info`}>
        <p className={`model-name ${pro ? "pro" : ""}`}>{model.name}</p>
        <div className={`model-tag`}>
          {model.tag &&
            model.tag.map((tag, index) => {
              return (
                <span className={`tag-item`} key={index}>
                  {t(`tag.${tag}`)}
                </span>
              );
            })}
        </div>
      </div>
      <div className={`grow`} />
      <div className={`model-action`}>
        <Button
          size={`icon`}
          variant={`ghost`}
          className={`scale-90`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            if (state === 0) dispatch(closeMarket());
            else if (state === 1) dispatch(removeModelList(model.id));
            else dispatch(addModelList(model.id));
          }}
        >
          {state === 0 ? (
            <ChevronRight className={`h-4 w-4`} />
          ) : state === 1 ? (
            <Trash2 className={`w-4 h-4`} />
          ) : (
            <Plus className={`w-4 h-4`} />
          )}
        </Button>
      </div>
    </div>
  );
}

type MarketPlaceProps = {
  search: string;
};

function MarketPlace({ search }: MarketPlaceProps) {
  const { t } = useTranslation();
  const select = useSelector(selectModel);

  const arr = useMemo(() => {
    if (search.length === 0) return supportModels;
    // fuzzy search
    const raw = splitList(search.toLowerCase(), [" ", ",", ";", "-"]);
    return supportModels.filter((model) => {
      const name = model.name.toLowerCase();
      const tag = (model.tag || []).join(" ").toLowerCase();
      const tag_translated = (model.tag || [])
        .map((item) => t(`tag.${item}`))
        .join(" ")
        .toLowerCase();
      return raw.every(
        (item) =>
          name.includes(item) ||
          tag.includes(item) ||
          tag_translated.includes(item),
      );
    });
  }, [search]);

  return (
    <div className={`model-list`}>
      {arr.map((model, index) => (
        <ModelItem
          model={model}
          key={index}
          className={`${select === model.id ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

function MarketHeader() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className={`market-header`}>
      <Button
        size={`icon`}
        variant={`ghost`}
        className={`close-action`}
        onClick={() => {
          dispatch(closeMarket());
        }}
      >
        <ChevronLeft className={`h-4 w-4`} />
      </Button>
      <p className={`title select-none text-center text-primary font-bold`}>
        {t("market.explore")}
      </p>
    </div>
  );
}

function MarketFooter() {
  const { t } = useTranslation();

  return (
    <div className={`market-footer`}>
      <a href={docsEndpoint} target={`_blank`}>
        <Link size={14} className={`mr-1`} />
        {t("pricing")}
      </a>
    </div>
  );
}

function ModelMarket() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className={`model-market`}>
      <MarketHeader />
      <SearchBar value={search} onChange={setSearch} />
      <MarketPlace search={search} />
      <MarketFooter />
    </div>
  );
}

export default ModelMarket;
