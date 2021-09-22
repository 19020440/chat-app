import {AuthStore} from './AuthStore'
import {ActionStore} from './ActionStore'
import {createContext, useContext}  from 'react';

export const stores = Object.freeze({
    AuthStore: new AuthStore,
    ActionStore: new ActionStore,
});

export const storesContext = createContext(stores);
export const StoresProvider = storesContext.Provider;