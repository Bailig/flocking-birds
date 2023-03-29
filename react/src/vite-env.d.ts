/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BIRD_TYPE: "curry" | "immutable" | "mutable";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
