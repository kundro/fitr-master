import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const languages = [{ value: "EN" }, { value: "RU" }];

export default function LanguageSelect() {
  return (
    <Box width={"max-content"}>
      <Select
        sx={{
          width: "100%",
          height: "45px",
          backgroundColor: "white",
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: 0 },
          paddingLeft: 0,
        }}
        IconComponent={(props) => (
          <KeyboardArrowDownIcon
            {...props}
            style={{
              color: "#000",
            }}
          />
        )}
        defaultValue={"EN"}
        displayEmpty
        onChange={async (ev) => {}}
        renderValue={(value) => {
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography style={{ fontWeight: 600 }}>{value}</Typography>
            </Box>
          );
        }}
      >
        {languages.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Typography color="primary.dark" style={{ fontWeight: 600 }}>
              {option.value}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
