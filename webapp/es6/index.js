import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: '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' 
// Input Your Open AI key here from
// https://platform.openai.com/account/api-keys
});
const openai = new OpenAIApi(configuration);

async function getImage(info) {
  const response = await openai.createImage({
    prompt: info,
    n: 1,
    size: "256x256"
  });

  return response.data.data[0].url;
}

async function getProductInfo(info) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ "role": "user", "content": `Generate a creative info in JSON for product type ${info}, use following structure  "{name: string, price: string, currency: string }", respond only with JSON` }]
  });

  const output = completion.data.choices[0].message.content;
  return JSON.parse(output);
}

function getProduct(info) {
  const productInfo$ = getProductInfo(info);
  const image$ = getImage(info);
  return Promise.all([productInfo$, image$]).then(([product, image]) => ({ ...product, imageUrl: image }));
}

async function execute() {
   const topic = 'Kid Toy';
   const productNumbers = 4;

   const promises = [];
   for (let i = 0; i < productNumbers; ++i) {
     promises.push(getProduct(topic))
   }

   const products = await Promise.all(promises);

   console.log(products);
}

execute();
