import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Grid,
  Tooltip,
  Stack,
  Alert,
} from "@mui/material";
import {
  AttachEmail,
  Call,
  CheckCircle,
  Close,
  Comment,
  Delete,
  LocationOn,
  Share,
} from "@mui/icons-material";
import businessIcon from "../../../assets/business.svg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../CustomTypographyBold";
import ActionMenu from "../../client-module/ActionMenu";
import {
  addCurrentClient,
  clearFields,
} from "../../../feature/client-module/clientSlice";
import ROUTES from "../../../routes/Routes";
const ListViewCard = ({ client }) => {
  console.log("applicatntjd data ", client);
  const darkMode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Action 1",
      icon: <Share fontSize="small" />,
      action: () => console.log("Action 1 clicked"),
    },
    {
      label: "Action 2",
      icon: <Comment fontSize="small" />,
      action: () => console.log("Action 2 clicked"),
    },
    {
      label: "Delete",
      icon: <Delete fontSize="small" />,
      action: () => console.log("Delete clicked"),
    },
  ];
  const detailHandler = (data) => {
    dispatch(addCurrentClient(data));
    const url = data?.name?.toLowerCase()?.replace(/ /g, "-");
    // const clientUrl = `${ROUTES.clientHome}${url}/12`;
    const clientUrl = `${ROUTES.clientHome}/${url}/${data?.id}`;
    navigate(clientUrl);
  };
  return (
    <Card
      onClick={() => detailHandler(client)}
      sx={{
        maxWidth: 1440,
        boxShadow: " 0px 6px 12px 0px #8C98A413",
        my: 2,
        py: 1,
        px: 1.2,
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      <CardContent>
        <Grid container>
          <Grid item xs={0.7}>
            <Box
              component="img"
              src={businessIcon}
              alt="logo"
              sx={{ width: "2.265rem" }}
            />
          </Grid>
          <Grid item xs={11.3} md={4}>
            <Box>
              <CustomTypographyBold
                fontSize={"18.4px"}
                color={"text.black"}
                textTransform={"capitalize"}
              >
                {client?.name}
              </CustomTypographyBold>
              <Box
                sx={{
                  pt: 0.8,
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                {(client?.budget_preference?.car_cost_covered === 1 ||
                  client?.budget_preference?.hotel_cost_covered === 1 ||
                  client?.budget_preference?.airfare_cost_covered === 1) && (
                  <CustomTypographyBold
                    lineHeight="21px"
                    fontSize={"14px"}
                    weight={400}
                    color={"text.or_color"}
                    textTransform={"none"}
                  >
                    Budget preferences :
                  </CustomTypographyBold>
                )}
                {client?.budget_preference?.airfare_cost_covered === 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "#1321441A",
                      color: "text.black",
                      p: 1,
                      ml: 0.5,
                      borderRadius: "5px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                    }}
                  >
                    Airline
                  </Typography>
                )}
                {client?.budget_preference?.hotel_cost_covered === 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "#1321441A",
                      color: "text.black",
                      p: 1,
                      ml: 0.5,
                      borderRadius: "5px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                    }}
                  >
                    Hotel
                  </Typography>
                )}
                {client?.budget_preference?.car_cost_covered === 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "#1321441A",
                      color: "text.black",
                      p: 1,
                      ml: 0.5,
                      borderRadius: "5px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                    }}
                  >
                    Car
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "action.selected",
                    color: "#BDC5D0",
                    mr: 1,
                  }}
                ></Avatar>
                <Box sx={{ pl: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12.3px",
                      fontWeight: 400,
                      lineHeight: "18.38px",
                    }}
                  >
                    Primary contact name
                  </Typography>
                  {client?.primary_contact_firstname && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "21px",
                        color: "text.black",
                        textTransform: "capitalize",
                      }}
                    >
                      {/* {client?.primaryContact} */}
                      {client?.primary_contact_firstname +
                        " " +
                        client?.primary_contact_lastname}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7.3}>
            <Box
              display="flex"
              justifyContent="end"
              alignItems="center"
              flexWrap={"wrap"}
              sx={{}}
            >
              <Box display="flex" alignItems="center" flexWrap={"wrap"}>
                <ActionMenu menuItems={menuItems} />
              </Box>
            </Box>
            <Box
              pt={"1rem"}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                justifyContent: "end",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {client?.phones?.length > 0 &&
                  client?.phones?.[0]?.phone &&
                  client?.phones?.slice(0, 1)?.map((c, index) => {
                    return (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "21px",
                          color: "text.or_color",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Call sx={{ fontSize: "1.1rem", mr: 0.5 }} />
                        {c?.phone}
                      </Typography>
                    );
                  })}
              </Box>
              {client?.email && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                    color: "text.or_color",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AttachEmail sx={{ fontSize: "1.1rem", mr: 0.5 }} />
                  {client?.email}
                </Typography>
              )}
              {(client?.addresses?.[0]?.state?.name ||
                client?.addresses?.[1]?.state?.name) && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                    color: "text.or_color",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationOn sx={{ fontSize: "1.1rem", mr: 0.5 }} />{" "}
                  {client?.addresses?.[0]?.state?.name ||
                    client?.addresses?.[1]?.state?.name}
                  ,
                  {client?.addresses[0]?.country?.name ||
                    client.addresses[1]?.country?.name}
                </Typography>
              )}
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={1}></Grid>
          <Grid item xs={12} md={11}>
            <Box
              pt={"1rem"}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  color: "text.or_color",
                }}
              >
                Assigned shifts:
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "21px",
                    color: "text.black",
                    pl: 0.5,
                  }}
                >
                  1
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  color: "text.or_color",
                }}
              >
                Open shifts:
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "21px",
                    color: "text.black",
                    pl: 0.5,
                  }}
                >
                  4
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  color: "text.or_color",
                }}
              >
                Closed shifts:
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "21px",
                    color: "text.black",
                    pl: 0.5,
                  }}
                >
                  8
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  color: "text.or_color",
                }}
              >
                Pending invoices:
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "21px",
                    color: "text.black",
                    pl: 0.5,
                  }}
                >
                  $ 1800
                </Typography>
              </Typography>
            </Box>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ListViewCard;
