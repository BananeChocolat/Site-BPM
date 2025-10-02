#pragma glslify: rgb2hsb = require('./hsl_rgb.glsl')
#pragma glslify: hsb2rgb = require('./hsl_rgb.glsl')

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
uniform float uTime;
uniform float uMirrorPass;
uniform float uOpacity;

vec3 alterBrightness(vec3 rgb, float amount) {
  vec3 hsl = rgb2hsb(rgb);
  //hsl.z += amount;
  return hsb2rgb(hsl);
}

// shader reference: https://www.shadertoy.com/view/lX2GDR
void main() {
  vec2 uv = vPos.xy * 2.;
  float d = uTime * 1.5;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
      a += cos(i * 1.2 + d - a * (uv.y));
      d += sin(uv.y * i + a);
      uv *= mat2(0.985,-0.174,0.174,0.985);
  }
  d -= uTime * 1.5;
  // red green oscillates with values of d and a, from a base of 0.4
  // blue oscillates with a + d, from a base of 0.5
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  // this kinda gives complementary colors of the input color
  col = cos(col * cos(vec3(d * 1.3, a * 1.5, 3.0)) * 0.75 + 0.75);
  
  // Make the colors to be darker from top to bottom
  col *= pow(vUv.y, 2.0) * 2.0 + 0.01;

  // adjust the center normal between mirror and final pass 
  // such that both the mirror and the real orb has the same fresnel angle applied
  vec3 cNormal = vec3(0., 0., 1.);
  if (uMirrorPass > 0.) {
    cNormal = vec3(0.0, 0.5, 0.866);
  }
  // fresnel rim
  float intensity = 1.4 - dot( vNormal, cNormal );
  col += vec3( 1.0 ) * pow(intensity, 5.0);

  // clamping to 0..1 ensures no color flashing
  col = clamp(col, vec3(0.), vec3(1.));
  
  gl_FragColor = vec4(col , uOpacity);

  // automatically applies the tonemapping settings from the rtf canvas if same renderer is in use
  //#include <tonemapping_fragment>
  // transform color from linear colorSpace to sRGBColorSpace
  #include <colorspace_fragment>
}