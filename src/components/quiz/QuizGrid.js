import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import EmptyOverlayGrid from '../common/EmptyOverlayGrid';
import { APP_URL, DEFAULT_PAGE_SIZE } from '../../constants';

function QuizGrid(props) {
  const { rows = [], rowCount, loading, onPublish, onEdit, onDelete, onChangePage } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [permalink, setPermalink] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const startIndex = page * pageSize;
  const gridData = rows.map((row, i) => ({ ...row, no: i + 1 + startIndex }));

  useEffect(() => {
    onChangePage(page + 1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleOpenShare = (e, permalinkId) => {
    setAnchorEl(e.currentTarget);
    setPermalink(`${APP_URL}/quizzes/public/${permalinkId}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleShareCopy = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      toast.info('Copied permalink!');
    } catch (err) {
      toast.error(
        `Failed to copy: clipboard copy requires a secure origin. But you can still copy permalink manually.`,
      );
    }
  };

  const columns = [
    { field: 'no', headerName: 'No', sortable: false },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <>
            <Link
              to={`quizzes/${cellValues.row._id}`}
              style={{ textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {cellValues.row.title}
            </Link>
          </>
        );
      },
    },
    {
      field: 'questions',
      headerName: 'Questions',
      align: 'center',
      sortable: false,
      renderCell: (cellValues) => {
        const { questions } = cellValues.row;

        return (
          <>
            <Typography>{questions.length}</Typography>
          </>
        );
      },
    },
    {
      field: 'share',
      headerName: 'Share',
      sortable: false,
      renderCell: (cellValues) => {
        const { permalinkId } = cellValues.row;

        return (
          <>
            <Tooltip title="Share" placement="top">
              <span>
                <IconButton
                  aria-label="share"
                  disabled={!permalinkId}
                  onClick={(e) => handleOpenShare(e, permalinkId)}
                >
                  <ShareIcon />
                </IconButton>
              </span>
            </Tooltip>
          </>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (cellValues) => {
        const { published, questions } = cellValues.row;

        return (
          <>
            <Tooltip title="Publish" placement="top">
              <span>
                <IconButton
                  aria-label="publish"
                  disabled={published || questions.length === 0}
                  onClick={() => onPublish(cellValues.row)}
                >
                  <PublishIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit" placement="top">
              <span>
                <IconButton
                  aria-label="edit"
                  disabled={published}
                  onClick={() => onEdit(cellValues.row)}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton aria-label="delete" onClick={() => onDelete(cellValues.row)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        getRowId={(data) => data._id}
        rows={gridData}
        rowCount={rowCount}
        loading={loading}
        rowsPerPageOptions={[5, 10, 15]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        autoHeight
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        columns={columns}
        hideFooterSelectedRowCount
        disableColumnMenu
        components={{
          NoRowsOverlay: EmptyOverlayGrid,
        }}
      />
      <Popover
        id="simple-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ p: 2 }}>{permalink}</Typography>
          <IconButton aria-label="copy" onClick={handleShareCopy}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Popover>
    </>
  );
}

export default QuizGrid;
