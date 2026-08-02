import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

function RecentDetections({ detections }) {
  return (
    <Paper
      elevation={5}
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Recent Detections
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Time</b>
            </TableCell>
            <TableCell>
              <b>Person</b>
            </TableCell>
            <TableCell>
              <b>Car</b>
            </TableCell>
            <TableCell>
              <b>Motorcycle</b>
            </TableCell>
            <TableCell>
              <b>Bus</b>
            </TableCell>
            <TableCell>
              <b>Truck</b>
            </TableCell>
            <TableCell>
              <b>Entries</b>
            </TableCell>
            <TableCell>
              <b>Exits</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {detections.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {new Date(item.created_at).toLocaleTimeString()}
              </TableCell>

              <TableCell>{item.people}</TableCell>
              <TableCell>{item.cars}</TableCell>
              <TableCell>{item.motorcycles}</TableCell>
              <TableCell>{item.buses}</TableCell>
              <TableCell>{item.trucks}</TableCell>
              <TableCell>{item.entries}</TableCell>
              <TableCell>{item.exits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default RecentDetections;
