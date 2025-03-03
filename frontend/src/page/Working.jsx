import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PendingIcon from '@mui/icons-material/Pending';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useNavigate } from 'react-router-dom';
export default function Working() {
  const navigate = useNavigate();

  const list = [
    {
      text: 'Create New Invoice Request',
      icon: <AddCircleIcon />,
      route: 'create'
    },
    {
      text: 'Pending Payment Requests',
      icon: <PendingIcon />,
      route: 'pending'
    },
    {
      text: 'Sent Payment Requests',
      icon: <MarkEmailReadIcon />,
      route: 'sent'
    }
  ]
  return (
    <>
      <p className='text-4xl font-bold my-10 text-white '>
        Welcome <span className='text-green-500'>Back!</span>
      </p>

      <Box sx={{ display: 'flex', }}>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              backgroundColor: '#161920',
              color: 'white',
              top: '184px',
              left: '180px',
              borderRight: 'none',
              position: 'sticky',
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              overflow: 'auto',
              background: 'linear-gradient(145deg, #161920, #161920)',
              padding: '8px',
              borderRadius: '12px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
            }}
            className="shadow-2xl rounded-lg"
          >
            <List>
              {list.map((obj, index) => (
                <ListItem key={obj.text} disablePadding onClick={() => navigate(obj.route)}>
                  <ListItemButton
                    sx={{
                      borderRadius: '8px',
                      transition: '0.3s',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>
                      {obj.icon}
                    </ListItemIcon>
                    <ListItemText primary={obj.text} sx={{ color: 'white' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            maxHeight: 'calc(80vh - 44px)',
            overflowY: 'auto',
            marginLeft: '30px',
            paddingLeft: '20px',
            scrollbarWidth: 'none',
          }}
          className='bg-[#1b1f29] rounded-md shadow-2xl text-white p-2'
        >

         
          <Typography sx={{ marginBottom: 2 }}>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
            eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
            neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
            tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
            sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
            tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
            tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
            eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
            posuere sollicitudin aliquam ultrices sagittis orci a.
            Lorem ipsum dolor, sit amet consectetur
            Placeat neque ipsa itaque accusamus, eaque error incidunt voluptatibus animi eum nam similique maiores, laudantium dignissimos. Aliquid odit mollitia dignissimos saepe hic quia, nihil repellendus asperiores eaque magni nulla exercitationem quas aperiam beatae sunt id ullam nobis quasi pariatur inventore obcaecati enim. Et omnis delectus, iusto, consequatur soluta reprehenderit officiis cum debitis nisi fuga nulla quasi quisquam suscipit numquam repellendus facilis quia id voluptas. Aliquam, vitae! Fuga, tempora debitis doloribus explicabo maiores magnam exercitationem temporibus sunt.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
