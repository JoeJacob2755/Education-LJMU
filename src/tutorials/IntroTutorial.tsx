
import React from "react"

import {TutorialMessage} from "./TutorialMessage"
import store from "../store/store.js"
import { keys } from "@material-ui/core/styles/createBreakpoints"
import { cpuUsage } from "process"

export const TutorialStore: {[key:string]: any} = {}



interface TutorialSteps {
    target: string;
    message: string;
    title: string;
    isCompleted: () => boolean
}

let pressed = false 
let updatePressed = (event:KeyboardEvent) => {
    if (event.keyCode === 13) {
        pressed = true
    }
}

window.addEventListener("keyup", updatePressed)

const onPressEnter = () => {
    if (pressed) {
        pressed = false
        return true
    } else {
        return false
    }
}



const storeOpen: TutorialSteps = {
    target: "#open-store-button",
    title: "Open the feature store",
    message: "To continue, open the feature store.",
    isCompleted: () => TutorialStore.featureStoreOpen
}

const sectionOpen: (sectionName: string) => TutorialSteps = (sectionName) => {
    return {
        target: ".feature-list-section .title--" +sectionName,
        title: `Open '${sectionName}'`,
        message: `To continue, click '${sectionName}'.`,
        isCompleted: () => TutorialStore[sectionName + "SectionOpen"]
    }
}

const recurseStructure = (start, branch, items) => {
    
    const strict = !branch["*"]
    const names = new Set<string>()


    for (const ind of start.items) {

        const subitem = items[ind]
        if (!subitem) continue

        let field;
        switch (subitem.class) {
            case "feature":
                field = "type"
                break;
            case "property":
                continue
                break;
            case "featureGroup":
                field = "name"
                break;
            default:
                field = "name"
                break;
        }
        names.add(subitem[field])

        if (branch[subitem[field]] !== undefined && !recurseStructure(subitem, branch[subitem[field]], items)) {
            return false
        }
    }

    for (const key in branch) {
        if (key !== "*" && !names.has(key)) {
            return false
        } else {
            names.delete(key)
        }
    }

    return !strict || names.size === 0  
    
}

const ensureStructure = (structure) => {
    const items = store.getState().undoable.present.items
    let done = true;
    
    for (const item of items) {
        if (!item) continue
        else if (item.class !== "featureGroup") continue
        else if (item.name === "root") continue
        else if (structure[item.name]) {
            done = done && recurseStructure(item, structure[item.name], items)
        }
    }
    return done
}



export const IntroTutorialSteps: TutorialSteps[] = [
    {
        target: "#open-store-button",
        title: "Welcome to DeepTrack 2.0",
        message: "In this tutorial, we will be simulating aberrated fluorescence particles. To start, open the feature store.",
        isCompleted: () => TutorialStore.featureStoreOpen
    }, {
        target: ".feature-list-section .title--optics",
        title: "First steps",
        message: "The feature store contains all the building blocks you need. Let's start with the optical device. Click 'optics' to continue!",
        isCompleted: () => TutorialStore.opticsSectionOpen
    }, {
        target: ".feature-list-section .title--Microscope",
        title: "Drag microscope to Image",
        message: "Most synthetic datasets will start with a microscope. Click and drag it from the list on the left, to the box named Image on the right.",
        isCompleted: ensureStructure.bind(this, {Image: {Microscope: {"*": true}}})
    }, {
        target: ".featureGroup.Config",
        title: "Config",
        message: "Here are six different sections, corresponding to different functions. Anything put in Config will not be executed. Can for example be used to set up global parameters using DummyFeature. Press enter to continue.",
        isCompleted: onPressEnter
    }, {
        target: ".featureGroup.Image",
        title: "Image",
        message: "Anything in Image will be executed when creating a datapoint or the label. Here you'll put the meat of your simulation. Press enter to continue.",
        isCompleted: onPressEnter
    }, {
        target: ".featureGroup.Label",
        title: "Label",
        message: "Anything in Label will only be executed when creating a label. Can for example contain Label or SampleToMasks. Press enter to continue.",
        isCompleted: onPressEnter
    }, {
        target: ".featureGroup.Preprocess",
        title: "Preprocess",
        message: "Anything passed to the network will first be passed through whatever is in Preprocess. Data normalization and resizing should be performed here. For example converting RGB images to grayscale. Press enter to continue.",
        isCompleted: onPressEnter
    }, {
        target: ".featureGroup.Network",
        title: "Network",
        message: "Inside Network you define the neural network itself. Convolutional and UNet are common choices! Press enter to continue.",
        isCompleted: onPressEnter
    }, {
        target: ".featureGroup.Postprocess",
        title: "Postprocess",
        message: "The output of the network will be passed through Postprocess before being sent back to the interface. For example thresholding, and rescaling the output. Press enter to continue.",
        isCompleted: onPressEnter
    },
    storeOpen,
    sectionOpen("optics"),
    {
        target: ".feature-list-section .title--Fluorescence",
        title: "Add Fluorescence",
        message: "We also define the exact modality we will use. For now, drag Fluorescence to 'objective' inside of 'Microscope'.",
        isCompleted: ensureStructure.bind(this, {Image: {Microscope: {sample:{}, objective:{Fluorescence: {pupil:{}}}}}})
    },
    storeOpen,
    sectionOpen("scatterers"),
    {
        target: ".feature-list-section .title--Sphere",
        title: "Add Sphere",
        message: "Finally we define what we want to image. For now, just a sphere. Click and drag Sphere to the box 'Sample' in 'Microscope'",
        isCompleted: ensureStructure.bind(this, {Image: {Microscope: {sample:{Sphere:{}}, objective:{Fluorescence: {pupil:{}}}}}})
    }, {
        target: ".refresh-button",
        title: "Create image",
        message: "Let's execute this setup, and see what happens",
        isCompleted: () => document.querySelector(".ylabel")
    }, {
        target: ".refresh-button",
        title: "Great!",
        message: "Feel free to change some values on the left around to see how they affect the image. For example, try increasing the magnification, or setting the z value to something non-zero. Once you are ready to continue, press enter!",
        isCompleted: onPressEnter
    }, 
    {
        target: ".property--position",
        title: "A bit of scripting",
        message: "Let's introduce a bit of randomness. Input `np.random.rand(2) * 128` into the box under position. \n\n`np.random.rand` means to create uniformly random numbers between 0 and 1, \n\n`(2)` means to create two of them, and \n\n`* 128` means to multiply those values by 128, which is the size of the image. Press refresh to ensure that the position of the particle is random, then press enter to continue. You may also try randomizing other values if you wish!",
        isCompleted: onPressEnter
    },
    storeOpen,
    sectionOpen("features"),
    {
        target: ".feature-list-section .title--Label",
        title: "Add Label",
        message: "Currently, the label is identical to the input. Let's change that. Click and drag `Label` on the left to the box `Label` below.",
        isCompleted: ensureStructure.bind(this, {Image: {Microscope: {sample:{Sphere:{}}, objective:{Fluorescence: {pupil:{}}}}}, Label: {Label: {}}})
    }, 
    {
        target: ".feature--Label .property-add-button",
        title: "Add more properties",
        message: "The Label feature creates named labels. Press the + button to add an additional property.",
        isCompleted: () => {

            const items = store.getState().undoable.present.items 
            for (const item of items) {
                if (!item) continue
                if (item.class === "featureGroup" && item.name === "Label") {
                    if (item.items.length !== 1) return false
                    
                    const lab = items[item.items[0]]

                    if (lab.type !== "Label") return false

                    if (lab.items.length == 2) return true
                }
            }
            return false
        }
    }, {
        target: ".feature--Label .property--",
        title: "Add more properties",
        message: "Name the property 'position'.",
        isCompleted: () => {

            const items = store.getState().undoable.present.items 
            for (const item of items) {
                if (!item) continue
                if (item.class === "featureGroup" && item.name ==="Label") {
                    if (item.items.length !== 1) return false
                    
                    const lab = items[item.items[0]]

                    if (lab.type !== "Label") return false

                    if (lab.items.length < 2) return false

                    if (items[lab.items[1]].name === "position") return true
                }
            }
            return false
        }
    }, {
        target: ".title--Label .property--",
        title: "Name the property",
        message: "Set the value to be Sphere.position",
        isCompleted: () => {

            const items = store.getState().undoable.present.items 
            for (const item of items) {
                if (!item) continue
                if (item.class === "featureGroup" && item.name === "Label") {
                    if (item.items.length !== 1) return false
                    
                    const lab = items[item.items[0]]

                    if (lab.type !== "Label") return false
                    if (lab.items.length < 2) return false
                    if (items[lab.items[1]].S === "Sphere.position") return true
                }
            }
            return false
        }
    }, {
        target: ".refresh-button",
        title: "Click the refresh button",
        message: "You'll now see that the label consists of two values corresponding to the sphere's position. Press enter to continue.",
        isCompleted: onPressEnter
    },
    {
        target: ".feature--Label",
        title: "Remove the label feature",
        message: "Let's look at another way to define the label. First, remove the Label feature by presing the cross.",
        isCompleted: ensureStructure.bind(this,  {Label:{}, Image: {Microscope: {sample:{Sphere:{}}, objective:{Fluorescence: {pupil:{}}}}}})
    }, {
        target: ".property--z",
        title: "Randomize the 'z' value.",
        message: "Enter `np.random.randn() * 25`",
        isCompleted: () => {

                    const items = store.getState().undoable.present.items 
                    for (const item of items) {
                        if (!item) continue 
                        if (item.class === "property" && item.name == "z") {
                            
                            return ["np.random.randn() * 25", "np.random.randn()* 25", "np.random.randn() *25", "np.random.randn()*25"].includes(item.S)
                        }
                    }
                    return false
                }
    }, {
        target: ".property--z",
        title: "Activate the label specific property",
        message: "Press the `L` button to the right of the name `z`",
        isCompleted: () => document.querySelector(".property--z .property-input-L")
    }, {
        target: ".property--z .property-input-L",
        title: "Activate the label specific property",
        message: "Anything here will be used when creating the label. For now, enter 0.",
        isCompleted: () => {

            const items = store.getState().undoable.present.items 
            for (const item of items) {
                if (!item) continue 
                if (item.class === "property" && item.name == "z") {
                    
                    return item.L === "0"
                }
            }
            return false
        }
    }, {
        target: ".refresh-button",
        title: "Click the refresh button",
        message: "You'll now see that the label is the input particle but refocused. Press enter to continue.",
        isCompleted: onPressEnter
    }, 
    storeOpen,
    sectionOpen("features"),
    {
        target: ".title--Duplicate",
        title: "Add duplicate",
        message: "Let's add more particles to the image. We can make this easy with the `Duplicate` feature! Click and drag it from the store on the left to directly next to `Sphere` (either before or after).",
        isCompleted: ensureStructure.bind(this,  {Label:{}, Image: {Microscope: {sample:{Sphere:{}, Duplicate:{feature:{}}}, objective:{Fluorescence: {pupil:{}}}}}})
    },
    {
        target: ".feature--Sphere",
        title: "Move Sphere inside Duplicate",
        message: "Click and drag `Sphere` into the box named `feature` inside of `Duplicate`",
        isCompleted: ensureStructure.bind(this,  {Label:{}, Image: {Microscope: {sample:{Duplicate:{feature:{Sphere:{}}}}, objective:{Fluorescence: {pupil:{}}}}}})
    }, {
        target: ".property--num_duplicates",
        title: "Set number of particles",
        message: "Try different integers, or even a random number using `np.random.randint(low, high)`, where low and high determines the bounds of the number of particles. Press enter to continue!",
        isCompleted: onPressEnter
    }, 
    {
        target: ".refresh-button",
        title: "Defining the model",
        message: "Before we define the model, take a moment to play around with adding more features! Try adding noise, a background illumination, or some aberration (inside the box `pupil` in `Fluorescence`)\n\nOnce you're ready to start training, press enter to continue!",
        isCompleted: onPressEnter
    }, 
    storeOpen,
    sectionOpen("models"),
    {
        target: ".title-UNet",
        title: "Add model",
        message: "Since this is an image-to-image transformation problem, we will use the U-Net. Click and drag `UNet` to the box `Network` to the right.",
        isCompleted: ensureStructure.bind(this, {Network:{UNet:{}}})
    }, {
        target: "#main-tab-2",
        title: "Go to `Train Model`",
        message: "Click on the `Train Model` tab.",
        isCompleted: () => TutorialStore.ActiveTabIndex === 1
    }, {
        target: "#add-to-queue-button",
        title: "Start training",
        message: "Click `ADD TO QUEUE` to start training the model. \n\n This ends this tutorial! At this point, you can wait for the model to train and visualize it's performance over time in `Loss` and `Validations`. To stop the training, press `Remove Entry`.",
        isCompleted: onPressEnter
    }

]

export default function Tutorial(props: {steps: TutorialSteps[], onEnd?: (finished:boolean)=>any}) {
    const [index, setIndex] = React.useState(0)

    const handleComplete = (shouldContinue: boolean | null) => {
        if (shouldContinue) {
            setIndex(index + 1)
        } else {
            setIndex(9999)
        }
    }
    pressed = false
    if (index < props.steps.length) {
        return (
            <TutorialMessage progress={(index+1) / props.steps.length} key={index} {...props.steps[index]} onCompleted={handleComplete}>
    
            </TutorialMessage>
        )
    } else {
        if (props.onEnd) props.onEnd(index === 9999)
        return null
    }

    
}