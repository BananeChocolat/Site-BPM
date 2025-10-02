// Define saturation macro, if not already user-defined
#ifndef saturate
#define saturate(v) clamp(v, vec3(0.), vec3(1.))
#endif

// Constants
const float HCV_EPSILON = 1e-10;
const float HSL_EPSILON = 1e-10;
const float HCY_EPSILON = 1e-10;

const float SRGB_GAMMA = 1.0 / 2.2;
const float SRGB_INVERSE_GAMMA = 2.2;
const float SRGB_ALPHA = 0.055;

// Converts from pure Hue to linear RGB
vec3 hue_to_rgb(float hue)
{
    float R = abs(hue * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(hue * 6.0 - 2.0);
    float B = 2.0 - abs(hue * 6.0 - 4.0);
    return saturate(vec3(R,G,B));
}

// Converts a value from linear RGB to HCV (Hue, Chroma, Value)
vec3 rgb_to_hcv(vec3 rgb)
{
    // Based on work by Sam Hocevar and Emil Persson
    vec4 P = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0/3.0) : vec4(rgb.gb, 0.0, -1.0/3.0);
    vec4 Q = (rgb.r < P.x) ? vec4(P.xyw, rgb.r) : vec4(rgb.r, P.yzx);
    float C = Q.x - min(Q.w, Q.y);
    float H = abs((Q.w - Q.y) / (6.0 * C + HCV_EPSILON) + Q.z);
    return vec3(H, C, Q.x);
}

// Converts from HSL to linear RGB
vec3 hsl_to_rgb(vec3 hsl)
{
    vec3 rgb = hue_to_rgb(hsl.x);
    float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
    return (rgb - 0.5) * C + hsl.z;
}

// Converts from linear rgb to HSL
vec3 rgb_to_hsl(vec3 rgb)
{
    vec3 HCV = rgb_to_hcv(rgb);
    float L = HCV.z - HCV.y * 0.5;
    float S = HCV.y / (1.0 - abs(L * 2.0 - 1.0) + HSL_EPSILON);
    return vec3(HCV.x, S, L);
}

vec3 rgb2hsb(in vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1e-10;
    float hue = (q.z + (q.w - q.y) / (6.0 * d + e));
    if (hue < 0.0) hue += 1.0; // Normalize hue to the range [0, 1]
    return vec3(hue, d / (q.x + e), q.x);
}
//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

#pragma glslify: export(rgb2hsb)
#pragma glslify: export(hsb2rgb)