var {
    StringHelper,
    TaskModel,
    TaskBoard
} = bryntum.taskboard;

// Custom task model with additional fields used by the demo
class CustomTask extends TaskModel {
    static get fields() {
        return ['category', 'team', 'quarter'];
    }
}
const taskBoard = new TaskBoard({
    appendTo            : 'container',
    // Experimental, transition moving cards using the editor
    useDomTransition    : true,
    // Field used to link tasks to columns
    columnField         : 'quarter',
    // Columns will be auto generated from the distinct values of task[columnField]
    autoGenerateColumns : true,
    // Headers should stick to the top
    stickyHeaders       : true,
    // Hide column tiles on collapse
    collapseTitle       : true,
    features            : {
        columnDrag : true,
        // Customize the task editor to allow editing our custom fields
        taskEdit   : {
            items : {
                // Hide column picker, since it will vary in this demo it will only be confusing
                column   : false,
                // Also hide color picker, not used in the styling of this demo
                color    : false,
                // Add pickers for our fields
                category : {
                    type     : 'combo',
                    name     : 'category',
                    label    : 'Category',
                    editable : false,
                    items    : ['Bug', 'Internal task', 'Feature request']
                },
                team : {
                    type     : 'combo',
                    name     : 'team',
                    label    : 'Team',
                    editable : false,
                    items    : ['Developers', 'DevOps', 'QA', 'UX']
                },
                quarter : {
                    type     : 'combo',
                    name     : 'quarter',
                    label    : 'Quarter',
                    editable : false,
                    items    : ['Q1', 'Q2', 'Q3', 'Q4']
                },
                status : {
                    type     : 'combo',
                    name     : 'status',
                    label    : 'Status',
                    editable : false,
                    items    : [['todo', 'Todo'], ['doing', 'Doing'], ['review', 'Review'], ['done', 'Done']]
                },
                prio : {
                    type     : 'combo',
                    name     : 'prio',
                    label    : 'Priority',
                    editable : false,
                    items    : [['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]
                }
            }
        }
    },
    // Toolbar with a combo used to pick field to generate columns from
    tbar : [{
        type       : 'combo',
        label      : 'Group by',
        editable   : false,
        inputWidth : '7em',
        items      : [['category', 'Category'], ['team', 'Team'], ['quarter', 'Quarter'], ['status', 'Status'], ['prio', 'Prio']],
        value      : 'quarter',
        onChange({
            value
        }) {
            taskBoard.columnField = value;
        }
    }],
    // Configure the project to use our custom task model and to load data remotely
    project : {
        taskModelClass : CustomTask,
        loadUrl        : 'data/data.json',
        autoLoad       : true
    },
    // Custom task renderer
    taskRenderer({
        cardConfig,
        taskRecord
    }) {
    // Append a new "details" element to each cards body, with some custom html in it to display field values
        cardConfig.children.body.children.details = {
            class : 'details',
            html  : StringHelper.xss`
                <label>Category</label><div>${taskRecord.category ?? 'None'}</div>
                <label>Team</label><div>${taskRecord.team ?? 'None'}</div>
                <label>Quarter</label><div>${taskRecord.quarter ?? 'None'}</div>
                <label>Status</label><div>${StringHelper.capitalize(taskRecord.status) ?? 'None'}</div>
                <label>Prio</label><div>${StringHelper.capitalize(taskRecord.prio) ?? 'None'}</div>
            `
        };

        // Color tasks by priority
        const prioColors = {
            critical : 'red',
            high     : 'orange',
            medium   : 'yellow',
            low      : 'green'
        };
        cardConfig.class[`b-taskboard-color-${prioColors[taskRecord.prio] ?? 'blue'}`] = true;
    }
});
