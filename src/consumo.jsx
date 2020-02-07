import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import Swal from 'sweetalert2';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    root: {
        width: '100%',
    }
}));

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open, DatosEmpresa } = props;


    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose}  className={classes.root}
        aria-labelledby="alert-dialog-title" open={open}>
            <DialogTitle  className={classes.root} >Detalle de la Empresa</DialogTitle>
            <DialogContent className={classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content"
                        id="panel1a-header" >
                        <Typography className={classes.heading}>Detalles de la Empresa
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <p>{DatosEmpresa.empresa ? DatosEmpresa.empresa.rucEmpresa : null}</p>
                        <p>{DatosEmpresa.cupo ? DatosEmpresa.cupo[0].totalCupo : null}</p>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

               
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} color="primary">
                    Aceptar
          </Button>
            </DialogActions>

        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};


const DetalleEmpresa = ({ rucEmpresa }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState("test");
    const [empresa, setEmpresa] = useState({});


    const handleClose = value => {
        setOpen(false);
        setSelectedValue(value);
    };

    const getDetallesEmpresa = async e => {
        e.preventDefault();
        //Consumo de la API 
        try {
            const result = await axios.get(`http://tomcat.emagic.fin.ec/ws/empresas/detalle/${rucEmpresa}`);
            if (result.status === 200) {
                setEmpresa(result.data);
                setOpen(true);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops... Hubo un error',
                text: 'Vuelve a intentarlo'
            })
        }
    }


    return (
        <Fragment>
            <IconButton variant="outlined" color="primary" onClick={getDetallesEmpresa}
                aria-label="upload picture" component="span">
                <InfoIcon />
            </IconButton>
            {empresa.empresa ?
                <SimpleDialog selectedValue={selectedValue}
                    DatosEmpresa={empresa}
                    open={open} onClose={handleClose} /> :
                <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
        </Fragment>
    );
}

export default DetalleEmpresa;
