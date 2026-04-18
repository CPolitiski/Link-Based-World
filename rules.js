class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
        this.engine.inventory = new Set(); // initialise inventory once here
    }
    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

    if (
        (locationData.RequiresItem && this.engine.inventory.has(locationData.RequiresItem)) ||
        (locationData.GivesItem && this.engine.inventory.has(locationData.GivesItem))
    ) {
        this.engine.show(locationData.Body2);
    } else {
        this.engine.show(locationData.Body);
    }

    let justPickedUp = false;
    if (locationData.GivesItem && !this.engine.inventory.has(locationData.GivesItem)) {
        this.engine.inventory.add(locationData.GivesItem);
        justPickedUp = true;
    }

    let alreadyHadItem = (locationData.GivesItem && this.engine.inventory.has(locationData.GivesItem) && !justPickedUp);
    let hasRequiredItem = (locationData.RequiresItem && this.engine.inventory.has(locationData.RequiresItem));

    let choices = (locationData.Choices2 && (alreadyHadItem || hasRequiredItem))
        ? locationData.Choices2
        : locationData.Choices;

    if (choices && choices.length > 0) {
        for (let choice of choices) {
            if (choice.RequiresItem && !this.engine.inventory.has(choice.RequiresItem)) {
                continue;
            }
            this.engine.addChoice(choice.Text, choice);
        }
    } else {
        this.engine.addChoice("The end.");
    }
}
    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End1);
        }
    }
}


class End1 extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.CreditsA);
    }
}

Engine.load(Start, 'myStory.json');