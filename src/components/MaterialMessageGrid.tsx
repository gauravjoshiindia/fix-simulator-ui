import * as React from "react";
import { DataGrid, GridColDef, GridRow } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { FixMessage } from "../interfaces/FixMessage";
import { MessageGridChildProps } from "../interfaces/MessageGridChildProps";
import { Box, Button, Grid2, Modal, Stack, Typography } from "@mui/material";
import { SessionParams } from "../interfaces/SessionParams";
import FileUploader from "./FileUploader";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "messageType", headerName: "Type", width: 70 },
  { field: "sendingTime", headerName: "Sending Time", width: 220 },
  {
    field: "senderCompId",
    headerName: "SenderCompId",
    width: 150,
  },
  {
    field: "targetCompId",
    headerName: "Target Comp ID",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 150,
    valueGetter: (value, row) => `${row.targetCompId || ""} `,
  },
  {
    field: "messageText",
    headerName: "Message Text",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 600,
  },
];

async function logout(sessionParams: SessionParams) {
  const url = "http://localhost:8080/stopSession";
  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionParams),
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

const paginationModel = { page: 0, pageSize: 5 };

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// export default function MaterialMessageGrid(
//   this: any,
//   sessionParams: MessageGridChildProps,
//   removeTab: () => void
// )
export function MaterialMessageGrid(messageGridProps: MessageGridChildProps) {
  const [messages, setMessages] = React.useState<FixMessage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [modalState, setmodalState] = React.useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = React.useState<string | null>(
    null
  );

  let dataPresent: boolean = false;

  const blankMessagesArray: FixMessage[] = [];

  React.useEffect(() => {
    const fetchFixMessages = async (timeoutMs: number = 5000) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const queryString = new URLSearchParams({
          fixVersion: messageGridProps.sessionParams?.fixVersion || "",
          senderCompId: messageGridProps.sessionParams?.senderCompId || "",
          targetCompId: messageGridProps.sessionParams?.targetCompId || "",
        });

        console.log(queryString.toString());
        const url = `http://localhost:8080/messages?${encodeURI(
          queryString.toString()
        )}`;

        const response = await fetch(url);
        clearTimeout(timeoutId);

        const data = await response.json();
        dataPresent = true;
        setMessages(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.log("Error:::::" + err);
        setMessages(blankMessagesArray);
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            throw new Error("Request timed out");
          }

          //setError(err.message);
        } else {
          //throw err;
          //setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFixMessages(2000);

    const intervalId = setInterval(fetchFixMessages, 2000); // Poll every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading....</p>;
  if (error)
    return (
      <h3 className="bg-dark text-white text-center">
        Something went wrong with API Call.
      </h3>
    );

  function showMessageModal(messageText: string) {
    setmodalState(true);
    setSelectedMessage(messageText);
  }
  const handleClose = () => setmodalState(false);

  async function upload(file: File) {
    const url =
      "http://localhost:8080/uploadMessagesForSession?" +
      "senderCompId=" +
      messageGridProps.sessionParams.senderCompId +
      "&targetCompId=" +
      messageGridProps.sessionParams.targetCompId +
      "&fixVersion=" +
      messageGridProps.sessionParams.fixVersion;

    console.log(file.name);
    console.log(url);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data: string = await response.text();
      console.log(data);
    } catch (error) {
      console.error("There was an error uploading messages:", error);
      throw error;
    }
  }

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <Grid2 container justifyContent="space-between" columns={2}>
        <Grid2 container>
          <Typography variant="h6" component="div" sx={{ mr: 6 }}>
            Session Messages for {messageGridProps.sessionParams?.fixVersion}
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ maxHeight: 1 / 3 }}
            onClick={(event) => {
              event.preventDefault();
              console.log("Submitting the form");
              logout(messageGridProps.sessionParams);
            }}
          >
            Logout
          </Button>
        </Grid2>
        <Grid2 columns={2}>
          <FileUploader uploadLabel="Upload Messages" onUpload={upload} />
        </Grid2>
      </Grid2>
      <DataGrid
        rows={messages}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        sx={{ border: 0 }}
        onCellDoubleClick={(event) => {
          const row = event.row as FixMessage;
          console.log(row.messageText);
          showMessageModal(row.messageText);
        }}
      />
      {modalState && (
        <Modal
          open={modalState}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          title="title"
        >
          <Box sx={style}>
            <Stack direction="column" spacing={1}>
              <Typography id="modal-modal-title" variant="h6" component="h6">
                FIX Message
              </Typography>

              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                {selectedMessage}
              </Typography>
            </Stack>
          </Box>
        </Modal>
      )}
    </Paper>
  );
}

export default MaterialMessageGrid;
