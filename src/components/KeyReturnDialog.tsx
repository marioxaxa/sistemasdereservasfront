import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import FullScreenFormDialog from "./FullScreenFormDialog";
import ScrollableList from "./ScrollableList";
import { ReservationT } from "../types/ReservationT";
import { StateContext } from "../context/ReactContext";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { RoomT } from "../types/RoomT";
import dayjs, { Dayjs } from "dayjs";
import { UserT } from "../types/UserT";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { KeyT } from "../types/KeyDeliveryT";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import KeyScrollableList from "./KeyScrollableList";
import getRoomById from "../utils/getRoomById";
import getUserById from "../utils/getUserById";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
};

export default function KeyReturnDialog({ isOpen, setIsOpen }: Props) {
    const { roomList, userList, loggedUser } = React.useContext(StateContext);

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const [selectedKey, setSelectedKey] = useState<KeyT | null>(null);

    const [formRoom, setFormRoom] = useState<RoomT | null>(null);

    const [formReturnTime, setFormReturnTime] = useState<Dayjs | null>(dayjs());

    const [formReservatedTo, setFormReservatedTo] = useState<UserT | null>(
        null
    );

    const [formResponsible, setFormResponsible] = useState<UserT | null>(null);

    const [formReturnedBy, setFormReturnedBy] = useState<UserT | null>(null);

    const [selectedInternalReservation, setSelectedInternalReservation] =
        useState<ReservationT | null>(null);

    const createMutation = useMutation({
        mutationFn: (header) => {
            return axios.post(
                "http://localhost:8080/keydelivery/create",
                header
            );
        },
        onSuccess: () => {
            //TODO setIsSnackBarOpen(true);
            handleClose();
        },
    });

    React.useEffect(() => {
        if (selectedKey) {
            console.log(selectedKey);

            const room: RoomT = getRoomById(selectedKey.roomId, roomList);
            setFormRoom(room);

            setFormReturnTime(dayjs(selectedKey.returnPrevision));

            const user: UserT = getUserById(
                selectedKey.responsibleForTheKeyId,
                userList
            );
            setFormReservatedTo(user);

            const userResponsible: UserT = getUserById(
                selectedKey.withdrawResponsibleId,
                userList
            );
            setFormResponsible(user);
        }
    }, [selectedKey]);

    const submitWithdraw = () => {
        const formatedStart = formReturnTime!.format("YYYY-MM-DDTHH:mm:ss");

        const header = {
            roomId: formRoom?.id,
            returnPrevision: formatedStart,
            withdrawResponsibleId: loggedUser.id,
            responsibleForTheKeyId: formReservatedTo?.id,
            withdrawTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            isKeyReturned: false,
        };

        console.log(header);

        createMutation.mutate(header);
    };

    return (
        <React.Fragment>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <Typography
                            sx={{ ml: 2, flex: 1, mr: 4 }}
                            variant="h6"
                            component="div"
                        >
                            Retirada de chave
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>
                            cancelar
                        </Button>
                    </Toolbar>
                </AppBar>

                <Stack direction={"row"}>
                    <KeyScrollableList setSelectedKey={setSelectedKey} />
                    <Stack
                        direction={"column"}
                        justifyContent={"space-between"}
                        marginX={2}
                        gap={2}
                        marginTop={2}
                    >
                        <Autocomplete
                            value={formRoom}
                            readOnly
                            id="controllable-states-demo"
                            options={roomList}
                            getOptionLabel={(room: RoomT) => {
                                let roomN = "";
                                if (room.roomNumber) {
                                    roomN = room.roomNumber;
                                }
                                return `${room.name} ${roomN}`;
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Sala reservada" />
                            )}
                        />
                        <Autocomplete
                            value={formReservatedTo}
                            readOnly
                            id="controllable-states-demo"
                            options={userList}
                            getOptionLabel={(user: UserT) => {
                                return user.name;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sala reservada para..."
                                />
                            )}
                        />
                        <TextField
                            id="outlined-controlled"
                            label="Supervisor da reserva"
                            value={loggedUser?.name}
                            readOnly
                            fullWidth
                        />

                        <DemoContainer components={["TimePicker"]}>
                            <TimePicker
                                label="Previsão de retorno"
                                value={formReturnTime}
                                onChange={(newValue) =>
                                    setFormReturnTime(newValue)
                                }
                                readOnly
                                sx={{ width: "100%" }}
                            />
                        </DemoContainer>
                    </Stack>
                </Stack>
                <Autocomplete
                    sx={{ margin: 2 }}
                    value={formReturnedBy}
                    onChange={(event: any, newValue: UserT | null) => {
                        setFormReturnedBy(newValue);
                    }}
                    id="controllable-states-demo"
                    options={userList}
                    getOptionLabel={(user: UserT) => {
                        return user.name;
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Chave retornada por..." />
                    )}
                />

                <Button
                    variant="contained"
                    sx={{ marginX: 6, marginY: 2 }}
                    onClick={submitWithdraw}
                >
                    Criar devolução
                </Button>
            </Dialog>
        </React.Fragment>
    );
}