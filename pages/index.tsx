import Head from "next/head"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import ImageEditor from "@/components/ImageEditor"
import DemoComponent from "@/components/Demo"
import { Icons } from "@/components/icons"
import { useRef } from "react"


export default function IndexPage() {

  const scrollRef = useRef<null | HTMLDivElement>(null)
  return (
    <Layout>
      <Head>
        <title>SnapFix</title>
        <meta
          name="description"
          content="Inpaint areas of your photos in just a few seconds using AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid place-items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="max-w-[980px] gap-2 text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            SnapFix - The Fast and Easy Way to Enhance Your Photos
          </h1>

          <p className="mt-4 text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Upload your photo, paint over the area you want to modify, write your prompt and let our AI-based inpainting technology add or modify the picture based on your prompt.
          </p>
        </div>
        <div className="mb-12">
          <video controls src={"/snapfix-demo-2.mp4"} className="m-auto w-3/4 rounded-lg shadow-lg" />
          <div className="m-auto w-40 text-center">
            <Button className="mt-8" onClick={() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }) }}> Let me do it!</Button>

          </div>
        </div>
        <div className="mt-16 flex gap-4">
        </div>
        <div className="max-w-lg">

          <div ref={scrollRef} className="mb-4 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            !AI is not perfect and it may throw weird results every now and then.! <br />
            Faces might get distored, bother me enough on <a href="https://twitter.com/deifosv" target="_blank" rel="noreferrer"><Icons.twitter className="inline h-5 w-5 fill-current" /></a>  and I&apos;ll fix it. 😊
          </div>
          <ImageEditor />
        </div>
        <DemoComponent />
      </section>
    </Layout>
  )
}
