import { useEffect, useRef, useState } from "react";
import { discussionPanelSelectType } from "../../../interfaces/DiscussionPanel";
import { fetchDataFromApi } from "../../shared/customFetch/exmple";
import ChatTextBox from "../../shared/ChatTextbox/ChatTextbox";
import { ChatBoxStatus } from "../../../enum/displayChatBoxStatus";
import style from "./ChattingField.module.css";
import Message from "../../shared/Message/Message";
import { selectedPanelDefault } from "../DirectMsgMain";


function MessagesHistory({ messages }: { messages: messageDto[] }) {
    const scrollDown = useRef<HTMLDivElement>(null);
  
    const scrollToBottom = () => {
      if (scrollDown.current != null)
        scrollDown.current.scrollIntoView({
          block: "end",
        });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
    return (
      <div className={style.messages_history}>
        {messages.map((messageElement: messageDto) => {
          return <Message key={messageElement.id} messageData={messageElement} />;
        })}
        {/* this is a dummy div created so that it references the bottom of the chatfield to scroll there whenever a message comes */}
        <div style={{ marginTop: "100px" }} ref={scrollDown}></div>
      </div>
    );
  }
  
  

  
  interface ChattingFieldPops {
    selectDiscussionState: {
      selectedDiscussion : discussionPanelSelectType,
      selectDiscussion : (e: discussionPanelSelectType) => void
  
    }
  }
  export function ChattingField({ selectDiscussionState }: ChattingFieldPops) {
    const { selectedDiscussion, selectDiscussion } = selectDiscussionState;
    const [messagesHistory, setMessageHistory] = useState<messageDto[]>([]);
  
    useEffect(() => {
      async function fetchDataAsync() {
        const messagesHistory_tmp = await fetchDataFromApi(
          `http://localhost:3001/chat/${selectedDiscussion.id}/messages`
        );
        setMessageHistory(messagesHistory_tmp);
      }
      if (selectedDiscussion != selectedPanelDefault) fetchDataAsync();
    }, [selectedDiscussion]);
  
    return (
      <div className={style.chat_field}>
        <MessagesHistory messages={messagesHistory} />
  
        <ChatTextBox
          selectedDiscussion={selectedDiscussion}
          messagesHistoryState={[messagesHistory, setMessageHistory]}
          displayStatus={
            selectedDiscussion !== selectedPanelDefault
              ? ChatBoxStatus.ACTIVE
              : ChatBoxStatus.INACTIVE
          }
        />
      </div>
    );
  }
  
  