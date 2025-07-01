// ItemDetail.jsx
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemDetail = ({ tagno, item, onRemove }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">
          Tag No: {tagno}
          <IconButton onClick={onRemove} sx={{ float: "right" }}>
            <DeleteIcon color="error" />
          </IconButton>
        </Typography>
        {item?.message?.[0] ? (
          <>
            <Typography>Name: {item.message[0].itemtype_name}</Typography>
            <Typography>Design: {item.message[0].designName}</Typography>
            <Typography>
              Weight: {parseFloat(item.message[0].gross).toFixed(3)} Gms
            </Typography>
          </>
        ) : (
          <Typography color="error">Item Not Found</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemDetail;
