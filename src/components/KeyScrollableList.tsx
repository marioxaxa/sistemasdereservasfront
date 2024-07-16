import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { StateContext } from "../context/ReactContext";
import {
    Box,
    Checkbox,
    IconButton,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListSubheader,
    Stack,
} from "@mui/material";
import getRoomById from "../utils/getRoomById";
import { Send } from "@mui/icons-material";
import dayjs from "dayjs";
import { KeyT } from "../types/KeyDeliveryT";

type Props = {
    setSelectedKey: (k: KeyT) => void;
    selectedKeyList: KeyT[];
    setSelectedKeyList: (k: KeyT[]) => void;
};

export default function KeyScrollableList({
    setSelectedKey,
    selectedKeyList,
    setSelectedKeyList,
}: Props) {
    const { keyList, roomList } = React.useContext(StateContext);

    const handleKeyListChange = (key: KeyT) => {
        const holder = selectedKeyList;

        const keyIndex = holder?.findIndex(
            (holderKey) => holderKey.id == key.id
        );

        if (keyIndex > -1) {
            holder?.splice(keyIndex, 1);
        } else {
            holder?.push(key);
        }
        setSelectedKeyList(holder);
    };

    return (
        <Stack direction={"row"}>
            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: "20rem",
                    "& ul": { padding: 0 },
                    "&::-webkit-scrollbar": { display: "none" },
                    marginLeft: 2,
                    marginTop: 2,
                    borderRadius: "2%",
                    minWidth: 200,
                }}
            >
                <ListSubheader>Salas Administrativas</ListSubheader>
                {keyList.map((item) => {
                    if (
                        getRoomById(item.roomId, roomList)?.administrative ==
                        false
                    )
                        return;
                    if (item.isKeyReturned) return;

                    const room = getRoomById(item.roomId, roomList);
                    let roomDisplayName = room?.name;
                    if (room?.roomNumber) {
                        roomDisplayName =
                            roomDisplayName + " " + room.roomNumber;
                    }

                    const withdratime = dayjs(item.withdrawTime).format(
                        "HH:mm"
                    );

                    const returnPrevision = dayjs(item.returnPrevision).format(
                        "HH:mm"
                    );

                    return (
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        setSelectedKey(item);
                                    }}
                                >
                                    <Send />
                                </IconButton>
                            }
                            disablePadding
                            sx={{ borderBottom: "1px solid gray" }}
                        >
                            <ListItemButton
                                role={undefined}
                                onClick={() => {
                                    handleKeyListChange(item);
                                }}
                                dense
                            >
                                <ListItemIcon sx={{ minWidth: "auto" }}>
                                    <Checkbox edge="start" disableRipple />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${roomDisplayName}`}
                                    secondary={`${withdratime}  -     ${returnPrevision}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: "20rem",
                    "& ul": { padding: 0 },
                    "&::-webkit-scrollbar": { display: "none" },
                    marginLeft: 2,
                    marginTop: 2,
                    borderRadius: "2%",
                    minWidth: 200,
                }}
            >
                <ListSubheader>Salas de aula</ListSubheader>
                {keyList.map((item) => {
                    if (getRoomById(item.roomId, roomList)?.administrative)
                        return;
                    if (item.isKeyReturned) return;

                    const room = getRoomById(item.roomId, roomList);
                    let roomDisplayName = room?.name;
                    if (room?.roomNumber) {
                        roomDisplayName =
                            roomDisplayName + " " + room.roomNumber;
                    }

                    const withdratime = dayjs(item.withdrawTime).format(
                        "HH:mm"
                    );

                    const returnPrevision = dayjs(item.returnPrevision).format(
                        "HH:mm"
                    );

                    return (
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        setSelectedKey(item);
                                    }}
                                >
                                    <Send />
                                </IconButton>
                            }
                            disablePadding
                            sx={{ borderBottom: "1px solid gray" }}
                        >
                            <ListItemButton
                                role={undefined}
                                onClick={() => {
                                    handleKeyListChange(item);
                                }}
                                dense
                            >
                                <ListItemIcon sx={{ minWidth: "auto" }}>
                                    <Checkbox edge="start" disableRipple />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${roomDisplayName}`}
                                    secondary={`${withdratime}  -     ${returnPrevision}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Stack>
    );
}
