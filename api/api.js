var authToken = require("./auth_token").auth_token;
var FastAPI = require("fastapi");
var cors = require("fastapi-middleware-cors");
var torch = require("torch");
var autocast = torch.autocast;
var StableDiffusionPipeline = require("./diffusers").StableDiffusionPipeline;
var fs = require("fs");
var base64 = require("base64-js");

var app = new FastAPI();

app.use(cors({
allowCredentials: true,
allowOrigins: [""],
allowMethods: [""],
allowHeaders: ["*"]
}));

var device = "cuda";
var modelId = "CompVis/stable-diffusion-v1-4";
var pipe = StableDiffusionPipeline.fromPretrained(modelId, {
revision: "fp16",
torch_dtype: torch.float16,
useAuthToken: authToken
});
pipe.to(device);

app.get("/", function (request, response) {
    autocast(device, function () {
        var image = pipe(request.query.prompt, {
            guidance_scale: 8.5
        }).images[0];
    }
}


