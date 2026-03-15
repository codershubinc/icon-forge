
declare function acquireVsCodeApi(): {
    postMessage(message: unknown): void;
    getState(): any;
    setState(state: any): void;
};

class VSCodeAPIWrapper {
    private readonly vsCodeApi: any;

    constructor() {

        if (typeof acquireVsCodeApi === "function") {
            this.vsCodeApi = acquireVsCodeApi();
        }
    }

    public postMessage(message: unknown) {
        if (this.vsCodeApi) {

            this.vsCodeApi.postMessage(message);
        } else {


            console.log("Mock VS Code Message:", message);
        }
    }
}


export const vscode = new VSCodeAPIWrapper();