import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import {
    Tree,
    MultiBackend,
    getBackendOptions
} from "@minoru/react-dnd-treeview";
import { DefaultSubCategoriesTreeDepth, useGetRootCategoriesQuery, useSaveCategoryMutation } from "../reducers";
import { CategoryTreeItem } from "./CategoryTreeItem";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import styles from "./CategoryTree.module.css";

export const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*": {
                    margin: 0,
                    padding: 0
                },
                "html, body, #root": {
                    height: "100%"
                },
                ul: {
                    listStyle: "none"
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: { verticalAlign: "middle" }
            }
        }
    }
});


const CategoryTree = ({ elements, saveCategory }) => {
    console.log(elements);
    const [treeData, setTreeData] = useState(elements);

    const handleDrop = (newTree, params) => {
        let targetCat = params.dropTarget?.cat;
        let sourceCat = params.dragSource?.cat;
        if (!sourceCat)
            throw new Error("No source");

        if (sourceCat.parent?._id !== targetCat?._id) {
            let parentCat = params.dragSource.parentCat;
            if (parentCat)
                parentCat.subCategories = parentCat.subCategories.filter(sc => sc?.cat._id !== sourceCat._id);
            if (!params.dropTarget.subCategories)
                params.dropTarget.subCategories = [];
            params.dropTarget.subCategories.push(params.dragSource);
            params.dragSource.parentCat = params.dropTarget;

            sourceCat.parent = targetCat ?? null;
            saveCategory(sourceCat);
            setTreeData(newTree);
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <div className={styles.app}>
                    <Tree
                        style={{ listStyleType: 'none', paddingLeft: '0px', height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                        tree={treeData}
                        rootId={0}
                        initialOpen={[1]}
                        render={(node, { depth, isOpen, onToggle }) => (
                            <CategoryTreeItem
                                node={node}
                                depth={depth}
                                isOpen={isOpen}
                                onToggle={onToggle}
                                saveCategoryName={(node, name) => {
                                    if (!node?.cat || node.cat.name === name)
                                        return;
                                    node.text = node.cat.name = name;
                                    saveCategory(node.cat);
                                }}
                            />
                        )}
                        dragPreviewRender={(monitorProps) => (
                            <CategoryTreeItem node={monitorProps.item} depth={0} isOpen={false}/>
                        )}
                        onDrop={handleDrop}
                        classes={{
                            root: styles.treeRoot,
                            draggingSource: styles.draggingSource,
                            dropTarget: styles.dropTarget
                        }}
                    />
                </div>
            </DndProvider>
        </ThemeProvider>
    );
}

let index = 2;
function wrapToTreeItems(cats, parentCat = null, catTreeItems = undefined) {
    catTreeItems ??= [];
    if (cats) {
        for (let cat of cats) {
            let catTreeItem = {
                "id": index++,
                "parent": parentCat?.id ?? 1,
                "parentCat": parentCat,
                "droppable": true,
                "text": cat.name,
                "image": cat.image ?? {},
                "cat": { _id: cat._id, name: cat.name, parent: parentCat?.cat ?? null },
            };
            if (!parentCat.subCategories)
                parentCat.subCategories = [];
            parentCat.subCategories.push(catTreeItem);
            catTreeItems.push(catTreeItem);
            wrapToTreeItems(cat.subCategories, catTreeItem, catTreeItems)
        }
    }
    return catTreeItems;
}

const CCategoryTree = () => {
    const { isLoading, data } = useGetRootCategoriesQuery(DefaultSubCategoriesTreeDepth);
    let cats = data?.CategoryFind;

    let catTreeItems = [];
    let rootCat = {
        id: 1,
        parent: 0,
        droppable: true,
        text: "...",
        cat: null
    }
    catTreeItems.push(rootCat);

    const [saveCategoryMutation] = useSaveCategoryMutation(true);

    const saveCategory = async (category) => {
        await saveCategoryMutation({ category });
    }

    return !isLoading && cats && <CategoryTree elements={wrapToTreeItems(cats, rootCat, catTreeItems)} saveCategory={saveCategory} />
}

export { CCategoryTree };

