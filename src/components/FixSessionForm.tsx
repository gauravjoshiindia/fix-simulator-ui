import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ChildProps from "../interfaces/ChildProps";
import { SessionParams } from "../interfaces/SessionParams";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4400",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

type LoginResponse = {
  status: number;
  alreadyLoggedIn: boolean;
};

function FixSessionForm(props: ChildProps) {
  async function login(body: SessionParams): Promise<LoginResponse> {
    const url = "http://localhost:8080/startSession";
    console.log(body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data: string = await response.text();
      const loginResponse: LoginResponse = JSON.parse(data);

      return loginResponse;
    } catch (error) {
      console.error("There was an error fetching the data:", error);
      throw error;
    }
  }

  const [sessionParams, setSessionParams] = useState<SessionParams>({
    fixVersion: "FIX.4.0",
    host: "",
    port: 0,
    senderCompId: "",
    targetCompId: "",
  });

  type Touched = Partial<Record<keyof SessionParams, boolean>>;
  const [touched, setTouched] = useState<Touched>({});

  const validate = (newInputs: SessionParams): Errors => {
    const newErrors: Errors = {};

    if (newInputs.fixVersion.length === 0) {
      newErrors.fixVersion = "Please Select a Valid FIX Version";
    }

    if (newInputs.host.length === 0) {
      newErrors.host = "Please Enter a Valid Host to connect to";
    }
    if (newInputs.port === 0) {
      newErrors.port = "Please Enter a Valid Port";
    }

    if (newInputs.senderCompId.length === 0) {
      newErrors.senderCompId = "Please Enter a Valid Sender Comp ID";
    }

    if (newInputs.targetCompId.length === 0) {
      newErrors.targetCompId = "Please Enter a Valid Target Comp ID";
    }

    return newErrors;
  };

  type Errors = Partial<Record<keyof SessionParams, string>>;
  //const [errors, setErrors] = useState<Errors>(validate(sessionParams));
  const [errors, setErrors] = useState<Errors>({});

  function disableLogin() {
    return Object.values(errors).some((error) => error !== undefined);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Typography
          variant="h6"
          component="div"
          justifyContent="center"
          justifyItems="center"
          display="flex"
          sx={{ flexGrow: 1 }}
        >
          Specify Session to Connect To
        </Typography>

        <Grid2 container justifyContent="center" spacing={1}>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="fix-version">FIX Version</InputLabel>
            <Select
              labelId="fix-version"
              id="fix-version"
              value={sessionParams.fixVersion}
              name="fixVersion"
              label="FIX Version"
              onChange={(event) => {
                setSessionParams({
                  ...sessionParams,
                  fixVersion: event.target.value as string,
                });
                setErrors(
                  validate({
                    ...sessionParams,
                    fixVersion: event.target.value as string,
                  })
                );
              }}
              onBlur={() => setTouched({ ...touched, fixVersion: true })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="FIX.4.0">4.0</MenuItem>
              <MenuItem value="FIX.4.1">4.1</MenuItem>
              <MenuItem value="FIX.4.2">4.2</MenuItem>
              <MenuItem value="FIX.4.3">4.3</MenuItem>
              <MenuItem value="FIX.4.4">4.4</MenuItem>
            </Select>
            <FormHelperText>FIX Version</FormHelperText>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 50, maxWidth: 200 }}>
            <TextField
              required
              label="Host"
              type="text"
              name="host"
              id="host"
              placeholder="IP Address or HostName"
              onChange={(event) => {
                setSessionParams({
                  ...sessionParams,
                  host: event.target.value,
                });
                setErrors(
                  validate({
                    ...sessionParams,
                    host: event.target.value,
                  })
                );
                disableLogin();
              }}
              onBlur={() => setTouched({ ...touched, host: true })}
              value={sessionParams.host}
              error={!!errors.host}
              helperText={errors.host}
            ></TextField>
            {/* <FormHelperText>IP Address or HostName</FormHelperText> */}
          </FormControl>

          {/* <ErrorMessage
                      name="username"
                      component="div"
                    ></ErrorMessage> */}
          <FormControl sx={{ m: 1, minWidth: 50, maxWidth: 100 }}>
            <TextField
              required
              label="Port"
              type="number"
              name="port"
              id="port"
              onChange={(event) => {
                setSessionParams({
                  ...sessionParams,
                  port: Number(event.target.value),
                });
                setErrors(
                  validate({
                    ...sessionParams,
                    port: Number(event.target.value),
                  })
                );
              }}
              onBlur={() => setTouched({ ...touched, port: true })}
              value={sessionParams.port}
              error={!!errors.port}
              helperText={errors.port}
            ></TextField>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 150 }}>
            <TextField
              required
              label="Sender Comp ID"
              type="text"
              name="senderCompId"
              id="senderCompId"
              onChange={(event) => {
                setSessionParams({
                  ...sessionParams,
                  senderCompId: event.target.value,
                });
                setErrors(
                  validate({
                    ...sessionParams,
                    senderCompId: event.target.value,
                  })
                );
              }}
              onBlur={() => setTouched({ ...touched, senderCompId: true })}
              value={sessionParams.senderCompId}
              error={!!errors.senderCompId}
              helperText={errors.senderCompId}
            ></TextField>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 150 }}>
            <TextField
              required
              label="Target Comp ID"
              type="text"
              name="targetCompId"
              id="targetCompId"
              onChange={(event) => {
                setSessionParams({
                  ...sessionParams,
                  targetCompId: event.target.value,
                });
                setErrors(
                  validate({
                    ...sessionParams,
                    targetCompId: event.target.value,
                  })
                );
              }}
              onBlur={() => setTouched({ ...touched, targetCompId: true })}
              value={sessionParams.targetCompId}
              error={!!errors.targetCompId}
              helperText={errors.targetCompId}
            ></TextField>
          </FormControl>
        </Grid2>
        <Grid2 container justifyContent="center" spacing={1}>
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            color="success"
            disabled={Object.keys(errors).length !== 0}
            onClick={(event) => {
              event.preventDefault();
              try {
                console.log("Submitting the form");
                let validationErrors: Errors = validate(sessionParams);
                if (Object.keys(validationErrors).length === 0) {
                  const resposeToLogin = login(sessionParams);
                  console.log(resposeToLogin);
                  resposeToLogin.then((loginResponse) => {
                    if (loginResponse.alreadyLoggedIn) {
                      alert("Session already exists");
                      return loginResponse;
                    } else if (loginResponse.status) {
                      props.addNewTab(sessionParams, 0);
                      return loginResponse;
                    } else {
                      alert("Error in starting session");
                      return loginResponse;
                    }
                  });
                } else {
                  setErrors(validate(sessionParams));
                }
              } catch (error) {
                console.error("There was an error fetching the data:", error);
                throw error;
              }
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 2 }}
            disabled={Object.keys(errors).length !== 0}
            onClick={(event) => {
              event.preventDefault();
              try {
                console.log("Getting Available Sessions and creating Tabs");
                props.addTabsForAvailableSessions();
              } catch (error) {
                console.error("There was an error fetching the data:", error);
                throw error;
              }
            }}
          >
            Open Connected Sessions
          </Button>
        </Grid2>
      </ThemeProvider>
    </>
  );
}

export default FixSessionForm;
