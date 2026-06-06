// Deep style imports from react-syntax-highlighter ship JS without bundled
// type declarations; declare them as modules so strict typecheck passes.
declare module 'react-syntax-highlighter/dist/esm/styles/prism';
declare module 'react-syntax-highlighter/dist/cjs/styles/prism';
