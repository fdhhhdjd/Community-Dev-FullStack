import swal from "sweetalert";
const MessageNotification = (title, icon) => {
  return swal(title, {
    icon: icon,
  });
};

export default MessageNotification;
