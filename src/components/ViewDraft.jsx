import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { MRT_TableContainer } from "material-react-table";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#424242", // Dark Gray, smooth with black-and-white theme
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

 export default function ViewDraft() {
   return (
     <MRT_TableContainer component={Paper}>
       <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
            <TableRow>
               <StyledTableCell align="right">Project</StyledTableCell>
               <StyledTableCell align="right">Task Name</StyledTableCell>
               <StyledTableCell align="right">Start Date</StyledTableCell>
               <StyledTableCell align="right">End Date</StyledTableCell>
               <StyledTableCell align="right">Effort (Hrs)</StyledTableCell>
               <StyledTableCell align="right">Update</StyledTableCell>
               <StyledTableCell align="right">Send</StyledTableCell>
            </TableRow>
        </TableHead>
        <TableBody>

        </TableBody>
       </Table>
     </MRT_TableContainer>
   );
 }