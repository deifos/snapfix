import type { NextApiRequest, NextApiResponse } from "next";
import * as Generation from "../../generation/generation_pb";
import { GenerationServiceClient } from "../../generation/generation_pb_service";
import { grpc as GRPCWeb } from "@improbable-eng/grpc-web";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import { buildGenerationRequest, executeGenerationRequest, onGenerationComplete } from "../../generation/helpers";
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
}

export type OutputResponse = {
    imageBase64?: string | null;
    errorMessage?: string | null;
};

interface InputPayload {
    originalImageUrl: string;
    maskUrl: string;
    prompt: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
    body: InputPayload;
    files: File[];
}

//Have to resize images to dimensions multiple of 64 or Stability AI will not like it
//this is not longer required since we are resizing the image in the front, but just in case we want to make an API out if this
//it could be usefull will need yarn add canvas.
// const resizeImageReturnAsBuffer = async (dataURL: string) => {
//     const img = await loadImage(dataURL);
//     const canvas = createCanvas(Math.ceil(img.width / 64) * 64, Math.ceil(img.height / 64) * 64);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     const buffer = canvas.toBuffer('image/png');
//     return buffer;
// };

const getBufferFromDataURL = (dataURL: string) => {

    const base64Data = dataURL.replace('data:', '').replace(/^.+,/, '');
    return Buffer.from(base64Data, 'base64');

}
// const onReadyBothFiles = async (originalPicture: Buffer, maskPicture: Buffer, prompt: string): Promise<string> => {
const onReadyBothFiles = async (originalPicture: string, maskPicture: string, prompt: string): Promise<string> => {
    const originalPictureBuffer = getBufferFromDataURL(originalPicture);
    const maskPictureBuffer = getBufferFromDataURL(maskPicture);

    // This is a NodeJS-specific requirement - browsers implementations should omit this line.
    GRPCWeb.setDefaultTransport(NodeHttpTransport());

    // Authenticate using your API key, don't commit your key to a public repository!
    const metadata = new GRPCWeb.Metadata();
    metadata.set("Authorization", "Bearer " + process.env.STABILITY_AI_KEY);

    // Create a generation client to use with all future requests
    const client = new GenerationServiceClient("https://grpc.stability.ai", {});

    const request = buildGenerationRequest("stable-inpainting-512-v2-0", {
        type: "image-to-image-masking",
        initImage: originalPictureBuffer,
        maskImage: maskPictureBuffer,
        prompts: [{ text: prompt }],
        samples: 1,
        cfgScale: 9,
        steps: 30,
        // sampler: Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M,
    });

    return new Promise(async (res, rej) => {
        try {
            const preGenerated = await executeGenerationRequest(client, request, metadata);
            const { result } = await onGenerationComplete(preGenerated);
            res(result)
        } catch (error) {
            rej(`Failed to make image-to-image-masking request: ${error}`);
        }
    });

}


export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse<OutputResponse>) {

    const finalResponse = await new Promise<OutputResponse>((res1, rej1) => {
        const form = formidable();
        let originalPicture: string = null;
        let maskPicture: string = null;
        let prompt: string = "";

        form.parse(req, async (err, fields, files) => {
            if (err) {
                rej1(`${err}`);
                return;
            }

            if (fields["prompt"]) {
                prompt = `${fields["prompt"]}`;
                console.log('555 prompt', prompt);
            }
            if (fields["originalPicture"]) {
                originalPicture = `${fields["originalPicture"]}`;
            }
            if (fields["maskPicture"]) {
                maskPicture = `${fields["maskPicture"]}`;
            }

            if (originalPicture && maskPicture && prompt) {

                try {
                    const imageBase64 = await onReadyBothFiles(originalPicture, maskPicture, prompt);
                    res1({ imageBase64 });
                } catch (error) {
                    rej1({ errorMessage: `${error}` });
                }
            }
            else {
                rej1({ errorMessage: "SAI: Input necessary not enough" });
            }

        });
    });

    if (finalResponse.errorMessage) {
        res.status(400).json({ errorMessage: finalResponse.errorMessage });
    }
    else {
        res.status(200).json({ imageBase64: finalResponse.imageBase64 });
    }

}
