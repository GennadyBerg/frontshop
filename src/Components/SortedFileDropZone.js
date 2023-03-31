import { DndContext, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { arrayMoveImmutable } from "array-move";
import { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { FileDropZone } from "./FileDropZone";
import { getFullImageUrl } from "../utills";
import { CardMedia, Paper } from "@mui/material";

const SortableItem = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id });

    const itemStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    };

    const Render = props.render

    return (
        <div style={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
            <Render {...{ item: props.item, ...(props.itemProp ?? {}) }} />
        </div>
    );
};


const Droppable = ({ id, items = [], itemProp, keyField, render }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
            {items.map((item) => (
                <SortableItem render={render} key={item[keyField]} id={item}
                    itemProp={itemProp} item={item} />
            ))}
        </SortableContext>
    );
};

function CSortedFileDropZone(props) {
    let render = file => {
        file = file.item ?? file;
        return (
            <div>
                <CardMedia component="img" key={file.name} src={file._id ? getFullImageUrl(file) : file.url} {...props.itemProp} />
            </div>
        );
    }
    props = { itemProp: { width: "100px" }, ...props, render: render, keyField: "name" }
    return <SortedFileDropZone {...props} />
}

function SortedFileDropZone({ sx, items: startItems, render, itemProp, keyField, onChange, horizontal }) {
    const [items, setItems] = useState(
        startItems ?? []
    );
    useEffect(() => {
        return setItems(startItems ?? []);
    }
        , [startItems])

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(items)
        }
    }, [items])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = ({ active, over }) => {
        let activeIndex = active.data.current.sortable.index;
        let overIndex = over?.data.current?.sortable.index;

        setItems((items) => {
            if (overIndex === undefined) {
                if (items.length === 1)
                    activeIndex = 0;
                items = [...items]
                items.splice(activeIndex, 1);
                return items;
            }
            else
                return arrayMoveImmutable(items, activeIndex, overIndex)
        });
    }

    const onDropFiles = droppedFiles => {
        return setItems(items => {
            return [...items, ...droppedFiles]
        }
        );
    }

    const containerStyle = { display: horizontal ? "flex" : '' };

    return (
        <>
            <Paper sx={sx}>
                <FileDropZone onDropFiles={onDropFiles}>
                </FileDropZone>
                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                >
                    <div style={containerStyle}>
                        <Droppable id="aaa"
                            items={items}
                            itemProp={itemProp}
                            keyField={keyField}
                            render={render} >
                        </Droppable>
                    </div>
                </DndContext>
            </Paper>
        </>
    );
}
export { CSortedFileDropZone };