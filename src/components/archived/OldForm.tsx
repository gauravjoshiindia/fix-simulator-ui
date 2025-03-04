import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

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

function FixSessionForm() {
  async function login(body: SessionParams) {
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

      const data: String = await response.text();
      return data;
    } catch (error) {
      console.error("There was an error fetching the data:", error);
      throw error;
    }
  }

  async function logout() {
    const url = "http://localhost:8080/stopSession";
    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: String = await response.text();
      return data;
    } catch (error) {
      console.error("There was an error fetching the data:", error);
      throw error;
    }
  }

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

  type SessionParams = {
    fixVersion: string;
    host: string;
    port: number;
    senderCompId: string;
    targetCompId: string;
  };

  const [sessionParams, setSessionParams] = useState<SessionParams>({
    fixVersion: "FIX.4.0",
    host: "",
    port: 0,
    senderCompId: "",
    targetCompId: "",
  });

  type Errors = Partial<Record<keyof SessionParams, string>>;
  const [errors, setErrors] = useState<Errors>(validate(sessionParams));

  type Touched = Partial<Record<keyof SessionParams, boolean>>;
  const [touched, setTouched] = useState<Touched>({});

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="container text-center bg-dark text-white">
          <h3>Specify Session to connect to</h3>
        </div>
        <form className="needs-validation">
          <Grid2 container spacing={2}>
            <div className="container">
              <div className="row bg-dark text-white d-flex align-items-center justify-content-center">
                {/* <div> */}
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="fix-version">Age</InputLabel>
                  <Select
                    labelId="fix-version"
                    id="fix-version"
                    //value={fixVersion}
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
                    <MenuItem value="FIX.4.4">4.4</MenuItem>
                    <MenuItem value="FIX.4.5">4.5</MenuItem>
                  </Select>
                  <FormHelperText>FIX Standard Version</FormHelperText>
                </FormControl>
                {/* </div> */}

                {/* <div className="col-sm-1">
                  <label>FIX Version</label>
                  <select
                    name="fixVersion"
                    className="form-control"
                    onChange={(event) => {
                      setSessionParams({
                        ...sessionParams,
                        fixVersion: event.target.value,
                      });
                      setErrors(
                        validate({
                          ...sessionParams,
                          fixVersion: event.target.value,
                        })
                      );
                    }}
                    onBlur={() => setTouched({ ...touched, fixVersion: true })}
                    value={sessionParams.fixVersion}
                  >
                    <option accessKey="FIX.4.0">FIX.4.0</option>
                    <option accessKey="FIX.4.1">FIX.4.1</option>
                    <option accessKey="FIX.4.2">FIX.4.2</option>
                    <option accessKey="FIX.4.3">FIX.4.3</option>
                    <option accessKey="FIX.4.4">FIX.4.4</option>
                  </select>
                </div> */}
                <div className="col-sm-2">
                  <label> Host</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustomHost"
                    placeholder="Host"
                    required
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
                    }}
                    onBlur={() => setTouched({ ...touched, host: true })}
                    value={sessionParams.host}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-sm-1">
                  <label>Port</label>
                  <input
                    type="number"
                    className="form-control"
                    id="validationCustomPort"
                    required
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
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Port Number.
                  </div>
                </div>
                <div className="col-sm-2 mb-3">
                  <label>Sender Comp ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustomSenderCompID"
                    placeholder="SenderCompId"
                    required
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
                    onBlur={() =>
                      setTouched({ ...touched, senderCompId: true })
                    }
                    value={sessionParams.senderCompId}
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Sender Comp ID.
                  </div>
                </div>

                <div className="col-sm-2 mb-3">
                  <label>
                    Target Comp ID
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomTargetCompID"
                      placeholder="Target Comp ID"
                      required
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
                      onBlur={() =>
                        setTouched({ ...touched, targetCompId: true })
                      }
                      value={sessionParams.targetCompId}
                    />
                    {errors.targetCompId ? (
                      <div className="invalid-feedback">
                        {errors.targetCompId}
                      </div>
                    ) : null}
                  </label>
                </div>
              </div>
            </div>
            <div className="container bg-dark">
              <div className="col-md-12 text-center">
                <button
                  type="button"
                  className="btn btn-success m-1"
                  onClick={(event) => {
                    event.preventDefault();

                    if (Object.keys(errors).length === 0) {
                      console.log("Submitting the form");
                      login(sessionParams);
                    } else {
                      console.log("Errors in the form");
                      console.log(errors);
                      console.log(sessionParams);
                    }
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={(event) => {
                    event.preventDefault();
                    console.log("Logging Out Session......");
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </Grid2>
        </form>
      </ThemeProvider>
    </>
  );
}

export default FixSessionForm;

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event: {
            preventDefault: () => void;
            stopPropagation: () => void;
          }) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();
