import { createSlice } from "@reduxjs/toolkit";
import { ConversationInstance, Model } from "@/api/types.ts";
import { Message } from "@/api/types.ts";
import { insertStart } from "@/utils/base.ts";
import { RootState } from "./index.ts";
import { defaultModels, planModels, supportModels } from "@/conf.ts";
import { getBooleanMemory, getMemory, setMemory } from "@/utils/memory.ts";

type initialStateType = {
  history: ConversationInstance[];
  messages: Message[];
  model: string;
  web: boolean;
  current: number;
  model_list: string[];
  market: boolean;
  mask: boolean;
};

export function inModel(model: string): boolean {
  return (
    model.length > 0 &&
    supportModels.filter((item: Model) => item.id === model).length > 0
  );
}

export function getPlanModels(level: number): string[] {
  return planModels
    .filter((item) => item.level <= level)
    .map((item) => item.id);
}

export function getModel(model: string | undefined | null): string {
  return model && inModel(model) ? model : supportModels[0].id;
}

export function getModelList(
  models: string | undefined | null,
  select: string | undefined | null,
): string[] {
  const list =
    models && models.length
      ? models.split(",").filter((item) => inModel(item))
      : [];
  const target = list.length ? list : defaultModels;
  const selection = getModel(select);
  if (!target.includes(selection)) target.push(selection);
  return target;
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    history: [],
    messages: [],
    model: getModel(getMemory("model")),
    web: getBooleanMemory("web", false),
    current: -1,
    model_list: getModelList(getMemory("model_list"), getMemory("model")),
    market: false,
    mask: false,
  } as initialStateType,
  reducers: {
    setHistory: (state, action) => {
      state.history = action.payload as ConversationInstance[];
    },
    removeHistory: (state, action) => {
      state.history = state.history.filter(
        (item) => item.id !== (action.payload as number),
      );
    },
    addHistory: (state, action) => {
      const name = action.payload.message as string;
      const id = state.history.length
        ? Math.max(...state.history.map((item) => item.id)) + 1
        : 1;

      state.history = insertStart(state.history, { id, name, message: [] });
      state.current = id;
      action.payload.hook(id);
    },
    setMessages: (state, action) => {
      state.messages = action.payload as Message[];
    },
    setModel: (state, action) => {
      setMemory("model", action.payload as string);
      state.model = action.payload as string;
    },
    setWeb: (state, action) => {
      setMemory("web", action.payload ? "true" : "false");
      state.web = action.payload as boolean;
    },
    toggleWeb: (state) => {
      const web = !state.web;
      setMemory("web", web ? "true" : "false");
      state.web = web;
    },
    setCurrent: (state, action) => {
      state.current = action.payload as number;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload as Message);
    },
    setMessage: (state, action) => {
      state.messages[state.messages.length - 1] = action.payload as Message;
    },
    setModelList: (state, action) => {
      setMemory("model_list", action.payload as string);
      state.model_list = action.payload as string[];
    },
    addModelList: (state, action) => {
      const model = action.payload as string;
      if (inModel(model) && !state.model_list.includes(model)) {
        state.model_list.push(model);
        setMemory("model_list", state.model_list.join(","));
      }
    },
    removeModelList: (state, action) => {
      const model = action.payload as string;
      if (inModel(model) && state.model_list.includes(model)) {
        state.model_list = state.model_list.filter((item) => item !== model);
        setMemory("model_list", state.model_list.join(","));
      }
    },
    setMarket: (state, action) => {
      state.market = action.payload as boolean;
    },
    openMarket: (state) => {
      state.market = true;
    },
    closeMarket: (state) => {
      state.market = false;
    },
    setMask: (state, action) => {
      state.mask = action.payload as boolean;
    },
    openMask: (state) => {
      state.mask = true;
    },
    closeMask: (state) => {
      state.mask = false;
    },
  },
});

export const {
  setHistory,
  removeHistory,
  addHistory,
  setCurrent,
  setMessages,
  setModel,
  setWeb,
  toggleWeb,
  addMessage,
  setMessage,
  setModelList,
  addModelList,
  removeModelList,
  setMarket,
  openMarket,
  closeMarket,
  setMask,
  openMask,
  closeMask,
} = chatSlice.actions;
export const selectHistory = (state: RootState): ConversationInstance[] =>
  state.chat.history;
export const selectMessages = (state: RootState): Message[] =>
  state.chat.messages;
export const selectModel = (state: RootState): string => state.chat.model;
export const selectWeb = (state: RootState): boolean => state.chat.web;
export const selectCurrent = (state: RootState): number => state.chat.current;
export const selectModelList = (state: RootState): string[] =>
  state.chat.model_list;
export const selectMarket = (state: RootState): boolean => state.chat.market;
export const selectMask = (state: RootState): boolean => state.chat.mask;

export default chatSlice.reducer;
