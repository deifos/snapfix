# SnapFix
Inpainting tool using Stable Diffusion, This project uses https://github.com/shadcn/ui 

![hero](public/images/hero.png)

#run

yarn install
yarn dev

Create a .env.local file and add you Stability AI API key.

# next-template

A Next.js 13 template for building apps with Radix UI and Tailwind CSS.

## Reference

### StabilityAI
https://platform.stability.ai/docs/getting-started/typescript-client
grpc@1.24.11: This library will not receive further updates other than security fixes. We recommend using @grpc/grpc-js instead.

## Features

- Radix UI Primitives
- Tailwind CSS
- Fonts with `@next/font`
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`

## Tailwind CSS Features

- Class merging with `taiwind-merge`
- Animation with `tailwindcss-animate`
- Conditional classes with `clsx`
- Variants with `class-variance-authority`
- Automatic class sorting with `eslint-plugin-tailwindcss`


### Study docs
[Stability AI](https://platform.stability.ai/docs/features/inpainting?tab=typescript)
[How to load image from url and resize and output buffer](https://github.com/HYPERHYPER/hypno/blob/main/pages/api/file/index.ts)
[Basic example how to call api on the backend of next and return result](https://github.com/HYPERHYPER/hypno/blob/be42c441428f4c04d6695abd09a9f92be688d919/pages/api/hugging/index.ts)
[example how to use SD for normal text to image](https://github.com/shaohaolin/InstagramWithAutomatedCaption/blob/669f9007a415b8f59353be5b4421ddba4be44425/insta-with-chat-gpt/components/ImageGenerator.tsx)