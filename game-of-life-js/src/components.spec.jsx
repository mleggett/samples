import { shallow } from 'enzyme';
import { GameController } from './GameController';
import React from 'react';

describe('Game instantiation', function() {
    it('should run', function() {
        const subject = shallow(<GameController />);
        console.log('***', subject.debug())
        expect(subject.text()).toBe('Start')
    });
});
