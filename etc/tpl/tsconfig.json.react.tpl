{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    /* React */
    "jsx": "react-jsx"
  },
  "include": [
    "**/*.tsx",
    "**/*.ts",
    "setup.ts",
    "vite.config.ts",
    "vitest.config.ts"
  ],
  "exclude": ["node_modules", "coverage", "dist"]
}
