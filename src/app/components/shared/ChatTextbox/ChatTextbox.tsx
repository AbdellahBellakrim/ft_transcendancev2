import React, { useEffect, useState } from "react";
import style from "./ChatTextbox.module.css";
import { Send } from "../../svgs";
import { useSessionUser } from "../../../context/SessionUserContext";
import { discussionPanelSelectType, selectDiscStateType } from "../../../interfaces/DiscussionPanel";
import socket from "../../../socket/socket"; // Import the socket object
import { ChatBoxStatus } from "../../../enum/displayChatBoxStatus";
import { useBanContext } from "../../../context/BanContext";
import { useHandleNewMsg } from "../../../../../hooks/useHandleNewMsg";
import { useHandleBan, useHandleUnBan } from "../../../../../hooks/useHandleBan";
import { useMuteContext } from "../../../context/MuteContext";
import { useHandleMute, useHandleUnMute } from "../../../../../hooks/useHandleMute";


const isMessageValid = (message:string) => { return message.trim() !== '';}




interface ChatTextBoxProps {
  selectedDiscussion: discussionPanelSelectType;
  displayStatus: ChatBoxStatus;
  messagesHistoryState: [
    messageDto[],
    React.Dispatch<React.SetStateAction<messageDto[]>>
  ];
}

function ChatTextBox({
  selectedDiscussion,
  messagesHistoryState,
  displayStatus,
}: ChatTextBoxProps) {

  const userSession = useSessionUser();
  
  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [isChatTextBoxDisabled, disableChatTextBox] = useState<boolean>(); // State to track if the chatTextBox is allowed or not  
  const BanContext = useBanContext()
  const MuteContext = useMuteContext()

  useHandleNewMsg(messagesHistoryState, selectedDiscussion)
  useHandleBan(BanContext, selectedDiscussion, disableChatTextBox)
  useHandleUnBan(BanContext, selectedDiscussion, disableChatTextBox)
  useHandleMute(MuteContext, selectedDiscussion, disableChatTextBox)
  useHandleUnMute(MuteContext, selectedDiscussion, disableChatTextBox)

  useEffect(() => {
        disableChatTextBox(BanContext.bannedRooms?.some((ban) => 
        {
          return (ban.room_id === selectedDiscussion.id)
        }));
  }, [selectedDiscussion]);

  const handleSendMessage = () => {
    if (isMessageValid(newMessageContent) === false)
      return;
    const newMessage = {
      user_id: userSession.id,
      content: newMessageContent,
      channel_id: selectedDiscussion.id,
      dm_id: selectedDiscussion.id,
      createdAt: new Date().toISOString(),
    };
    socket.emit("sendMsg", newMessage);
    setNewMessageContent("");
  };

  if (!selectedDiscussion.id ) return null;

  return (
    <div className={`${style.message_bar} ${style.middlePos}`}>
      {isChatTextBoxDisabled ? (
        <div className={style.banned_message}>
          You can't message this person anymore.
        </div>
      ) : (
        <>
          <textarea
            className={`${style.message_input_bar} `}
            placeholder="Type a message..."
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
          />
          <Send
            onClick={handleSendMessage}
            className={`${style.message_send_icon__init_fill} ${style.message_send_icon}`}
          />
        </>
      )}
    </div>
  );
}

export default ChatTextBox;
