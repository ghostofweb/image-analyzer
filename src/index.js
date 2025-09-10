import { GoogleGenAI } from '@google/genai';

function returnAI(){
    const ai = new GoogleGenAI({});
    return ai;
}
export default returnAI;