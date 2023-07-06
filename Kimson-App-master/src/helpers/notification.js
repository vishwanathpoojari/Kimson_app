import { Button, notification, Space } from 'antd';
import React from 'react';
notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    rtl: true,
});
export const openNotificationWithIcon = (type, title,text) => {
  notification[type]({
    message: title,
    description:text
  });
};