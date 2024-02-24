varying highp vec2 vTexture;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTexture);
}