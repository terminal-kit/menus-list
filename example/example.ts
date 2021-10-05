import termkit, {NextGenEvents, Terminal} from 'terminal-kit';

import {paginatedMenus} from '../src/index';

const term = termkit.terminal;

term.fullscreen();
term.windowTitle('example of menus-list');


term.on('key', function (name, matches, data) {
    if (name === 'CTRL_C' || name === 'ESCAPE' || name === 'x') {
        exitTerm();
    }
});

const exitTerm = () => {
    term.clear();
    term.cyan('exiting...\n');
    term.grabInput(false);
    setTimeout(() => {
        process.exit()
    }, 100);
};

const items1 = [
    'a',
    'b',
    'c',
    'd',
];

const example1 = () => {
    term.clear();
    return paginatedMenus(items1, undefined, undefined, (response)=>{
        console.log('selected', response);
        term.green( "\n#%s %s: %s (%s,%s)\n" ,
            response.selectedIndex ,
            response.submitted ? 'submitted' : 'selected' ,
            response.selectedText ,
            response.x ,
            response.y
        );

        term.processExit();
    });
};

// example1();


const items2 = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
];

const example2 = () => {
    term.clear();
    const response = paginatedMenus(items2, undefined, 5, (response)=>{
        console.log('selected', response);
        term.green( "\n#%s %s: %s (%s,%s)\n" ,
            response.selectedIndex ,
            response.submitted ? 'submitted' : 'selected' ,
            response.selectedText ,
            response.x ,
            response.y
        );

        term.processExit();
    });
    // term.processExit();
};

example2();

