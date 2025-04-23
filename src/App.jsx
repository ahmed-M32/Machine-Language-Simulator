/* eslint-disable no-unused-vars */
import Simulator from "./page/Simulator.jsx";
import { SimContextProvider } from "./context/context.jsx";
import { ThemeProvider } from "./context/themeContext.jsx";

const App = () => {
    return (
        <ThemeProvider>
            <SimContextProvider>
                <div className="app">
                    <Simulator />
                </div>
            </SimContextProvider>
        </ThemeProvider>
    );
};

export default App;
