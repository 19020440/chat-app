import React from "react";
import { stores, storesContext } from "./Store/index";

export const useStores = () => React.useContext(storesContext);

export const useStore = (
    store
)=> React.useContext(storesContext)[store];