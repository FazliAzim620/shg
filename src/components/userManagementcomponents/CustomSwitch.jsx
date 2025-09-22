import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    size="small"
  />
))(({ theme }) => ({
  width: 38,
  height: 18,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    margin: "0.1rem 00.25rem",
    padding: 0,
    transitionDuration: "300ms",
    color: "rgba(0, 0, 0, 0.15)",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        border: 0,
        backgroundColor: "text",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 16,
    height: 15,
    boxSizing: "border-box",
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#EEF0F7",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
