import "./App.css";
import ReactContext from "./context/ReactContext";
import ThemeContext from "./context/ThemeContext";
import DateContext from "./context/DateContext";
import { Container, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import DaysTable from "./components/DaysTable";
import QueryContext from "./context/QueryContext";
import GlobalSnackBar from "./components/GlobalSnackBar";
import MainContainer from "./components/MainContainer";

function App() {
    return (
        <>
            <QueryContext>
                <ReactContext>
                    <ThemeContext>
                        <DateContext>
                            <>
                                <Container maxWidth={false} sx={{ marginTop:10 }}>
                                    <NavBar />
                                    <MainContainer />
                                    <GlobalSnackBar />
                                </Container>
                                <CssBaseline enableColorScheme />
                            </>
                        </DateContext>
                    </ThemeContext>
                </ReactContext>
            </QueryContext>
        </>
    );
}

export default App;
