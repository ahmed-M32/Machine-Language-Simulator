/* eslint-disable no-unused-vars */
import Simulator from "./page/Simulator.jsx";
import { SimContextProvider } from "./context/context.jsx";
const App = () => {


	return(
	<SimContextProvider>
		<Simulator />
	</SimContextProvider>)
};

export default App;
