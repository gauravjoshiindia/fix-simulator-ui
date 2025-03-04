import FixSessionForm from "./components/FixSessionForm";
import MessageTab from "./components/archived/MessageTab";
import { LabTabs } from "./components/LabTabs";
import { useEffect, useState } from "react";
import { SessionParams } from "./interfaces/SessionParams";

function App() {
  const [messageTabs, setMessageTabs] = useState<MessageTab[]>([]);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    console.log("Before Calling Available Sessions after message Tabs change ");
    addTabsForAvailableSessions();
  }, [messageTabs]);

  function addNewTab(sessionParams: SessionParams, index: number = 0): void {
    let tab: MessageTab = {
      index: messageTabs.length + index++,
      title:
        sessionParams.fixVersion +
        ":" +
        sessionParams.senderCompId +
        "->" +
        sessionParams.targetCompId,
      sessionParams: sessionParams,
      isVisible: true,
    };
    addTab(tab);
  }

  async function addTabsForAvailableSessions(): Promise<void> {
    const url = "http://localhost:8080/availableSessions";

    try {
      console.log("Before calling Avaialble Sessions");
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data: string = await response.text();
      const availableSessions: SessionParams[] = JSON.parse(data);
      setErrors([]);

      let index = 0;
      availableSessions.forEach((availableSession) => {
        addNewTab(availableSession, index);
      });
    } catch (error) {
      //errors.push(error);
      if (error instanceof TypeError) {
        const err = error as TypeError;
        errors.push(err);
        setErrors(errors);
      } else {
        const err = error as TypeError;
        console.error(err.message);
        errors.push(err);
        setErrors(errors);
      }
    }
  }

  async function closeSession(
    sessionParams: SessionParams,
    changedMessageTabs: MessageTab[]
  ): Promise<void> {
    const url = "http://localhost:8080/stopAndClearSession";

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
      setMessageTabs(changedMessageTabs);
    } catch (error) {
      const err = error as TypeError;
      console.error(
        "There was an error Closing a Session:",
        err.name,
        err.message
      );
      throw error;
    }
  }

  function addTab(tab: MessageTab) {
    const isTabPresent = messageTabs.some(
      (messageTab) =>
        messageTab.sessionParams.fixVersion === tab.sessionParams.fixVersion &&
        messageTab.sessionParams.senderCompId ===
          tab.sessionParams.senderCompId &&
        messageTab.sessionParams.targetCompId === tab.sessionParams.targetCompId
    );

    if (isTabPresent) {
      console.log("Tab is already present");
    } else {
      console.log(
        "Adding Tab : " +
          tab.index +
          ":" +
          tab.sessionParams.fixVersion +
          ":" +
          tab.sessionParams.senderCompId +
          "->" +
          tab.sessionParams.senderCompId
      );
      messageTabs.push(tab);
      setMessageTabs([...messageTabs]);
      console.log("Tab added");
    }
  }

  function removeTab(sessionParams: SessionParams) {
    const changedMessageTabs: MessageTab[] = messageTabs.filter(
      (messageTab) =>
        !(
          messageTab.sessionParams.fixVersion === sessionParams.fixVersion &&
          messageTab.sessionParams.senderCompId ===
            sessionParams.senderCompId &&
          messageTab.sessionParams.targetCompId === sessionParams.targetCompId
        )
    );
    //let index: number = 0;
    // changedMessageTabs.forEach(
    //   (messageTab: MessageTab) => (messageTab.index = index)
    // );

    closeSession(sessionParams, changedMessageTabs);
  }

  return (
    <div>
      <section id="about-section" className="pt-5 pb-5">
        <FixSessionForm
          addNewTab={addNewTab}
          currentTabCount={messageTabs.length}
          addTabsForAvailableSessions={addTabsForAvailableSessions}
        />
      </section>
      {errors.length === 0 && messageTabs.length > 0 && (
        <section id="messages" className="pt-5 pb-5">
          <LabTabs tabs={messageTabs} removeTab={removeTab} />
        </section>
      )}
      {errors.length > 0 && (
        <section id="errors" className="pt-5 pb-5">
          <div>
            There are errors:{" "}
            {errors.map((error: TypeError) => error.message).join(", ")}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
