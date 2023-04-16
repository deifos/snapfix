import CompareSlider from "./CompareSlider"


const DemoComponent = () => {

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl text-gray-700 shadow-lg dark:bg-slate-50">
                <CompareSlider
                    original={"/images/demo1.png"}
                    generated={"/images/demo1_generated.png"}
                />

                <div className="px-6 py-4">
                    <div className="mb-2 text-xl font-bold">Prompt</div>
                    <p className="text-base">
                        Illustration of a beautiful girl, cubism style, high detail, colorful.
                    </p>
                </div>
            </div>
            <div className="rounded-xl text-gray-700 shadow-lg dark:bg-slate-50">
                <CompareSlider
                    original={"/images/demo2.png"}
                    generated={"/images/demo2_generated.png"}
                />

                <div className="px-6 py-4">
                    <div className="mb-2 text-xl font-bold">Prompt</div>
                    <p className="text-base">
                        A man wearing a elegant suit, high end fashion.
                    </p>
                </div>
            </div>
            <div className="rounded-xl text-gray-700 shadow-lg dark:bg-slate-50">
                <CompareSlider
                    original={"/images/demo3.png"}
                    generated={"/images/demo3_generated.png"}
                />

                <div className="px-6 py-4">
                    <div className="mb-2 text-xl font-bold">Prompt</div>
                    <p className="text-base ">
                        A black vest, high detail, style, fashion.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DemoComponent