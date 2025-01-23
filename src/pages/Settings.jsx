import { Button, List, ListItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getTagApi, updateTagApi } from "../configs/api";

//TODO: What if the newly typed tag has duplicated name?
// TODO: Rename
// TODO: Color: 

function InputTags() {
  const [tags, setTags] = useState([]);

  function handleTagChangeSubmit(tagId, tagName) {
    updateTagApi(tagId, tagName)
  }

  useEffect( () => {
    async function fetchTags() {
      const response = await getTagApi();
      const fetchedTags = response.data
      setTags(fetchedTags);
    }

    fetchTags();
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <List>
          {tags.map(
            tag => (
              <ListItem key={tag.name} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TagElement tag={tag} handleTagChangeSubmit={handleTagChangeSubmit}/>
            </ListItem>
          ))}
      </List>
    </Box>
  );
}

function TagElement({tag, handleTagChangeSubmit}) {
  const [editedTag, setEditedTag] = useState(tag);

  return (
    <Box>
    <div style={{width: 20, height: 20, background: tag.color}}></div>
    <TextField
      id="input-with-sx"
      variant="standard"
      value= {editedTag.name}
      onChange={e => setEditedTag({...editedTag, name: e.target.value})}
      / >
    <Button onClick={() => handleTagChangeSubmit(editedTag.id, editedTag.name)}>Update Tag</Button>
  </Box>
  )
}

export default function Settings(){
  return (
    <InputTags />
  )
}