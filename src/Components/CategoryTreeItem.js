import React from "react";
import { TextField } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import styles from "./CategoryTreeItem.module.css";
import { useDragOver } from "@minoru/react-dnd-treeview";
import { AvatarImage } from "./AvatarAnimated";
import { getFullImageUrl } from "../utills";
import CategoryIcon from '@mui/icons-material/Category';

export const CategoryTreeItem = (props) => {
    const { id, droppable, data } = props.node;
    const indent = props.depth * 40;

    const handleToggle = (e) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

    return (
        <div
            className={`tree-node ${styles.root}`}
            style={{ paddingInlineStart: indent }}
            {...dragOverProps}
        >
            <div
                className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""
                    }`}
            >
                {props.node.droppable && props.node.subCategories?.length > 0 && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon color="secondary" />
                    </div>
                )}
            </div>
            <div>
                {
                    props.node.image?.url ?
                        <AvatarImage variant='rounded' src={getFullImageUrl(props.node.image)} />
                        :
                        <AvatarImage variant='rounded' sx={{ bgcolor: "rgba(184, 200, 239, 0.63)" }}><CategoryIcon color="secondary"/></AvatarImage>
                }

            </div>
            <div className={styles.labelGridItem}>
                <TextField
                    color="primary"
                    InputProps={{
                        sx: {
                            "& input": {
                                fontSize: "1.5em",
                                display: 'flex',
                                alignItems: 'center',
                                color: 'darkBlue',
                                fontWeight: 'bold',
                            }
                        },
                    }}
                    id="filled-basic" defaultValue={props.node.text} size="small"
                    onBlur={e => props.saveCategoryName(props.node, e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Escape') {
                            e.target.value = e.target.defaultValue;
                        }
                    }}
                />
            </div>
        </div>
    );
};