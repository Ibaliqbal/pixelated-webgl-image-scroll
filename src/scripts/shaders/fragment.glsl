varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uProgress;
uniform float uPixels[20];

vec2 getUV(vec2 uv, vec2 texureSize, vec2 planesize){
	vec2 tempUV = uv - vec2(.5);

	float planeAspect = planesize.x / planesize.y;
	float textureAspect = texureSize.x / texureSize.y;

	if(planeAspect < textureAspect){
		tempUV = tempUV * vec2(planeAspect/textureAspect, 1.);
	}else{
		tempUV = tempUV * vec2(1., textureAspect/planeAspect);
	}


	tempUV += vec2(0.5);
	return tempUV;
}


void main() {
  vec2 uv = getUV(vUv, uImageResolution, uResolution);

  int indexProgress = int(uProgress * 19.99); 
  
  float pixelFactor = uPixels[indexProgress];

  vec4 finalTexture;

  if (pixelFactor >= 1.0) {
    
    finalTexture = texture2D(uTexture, uv);
    
  } else {
    
    float imageAspect = uImageResolution.x / uImageResolution.y;
    float pixellation = uResolution.x * pixelFactor;
    
    vec2 gridSize = vec2(pixellation, floor(pixellation / imageAspect));
    vec2 newUv = (floor(uv * gridSize) / gridSize) + (0.5 / gridSize);
    
    finalTexture = texture2D(uTexture, newUv);
  }

  gl_FragColor = finalTexture;
}