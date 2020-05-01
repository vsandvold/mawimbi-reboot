import { render } from '@testing-library/react';
import React from 'react';
import { mockTrack } from '../../../testUtils';
import Workstation from '../Workstation';
import {
  useDropzoneDragActive,
  useMixerDrawerHeight,
  useMutedTracks,
  usePlaybackToggle,
  useSpacebarPlaybackToggle,
  useTransportTime,
} from '../workstationEffects';

jest.mock('../EmptyTimeline', () => () => (
  <div data-testid="empty-timeline"></div>
));
jest.mock('../Mixer');
jest.mock('../Scrubber', () => ({ children }: any) => (
  <div data-testid="scrubber">{children}</div>
));
jest.mock('../Timeline', () => () => (
  <div data-testid="regular-timeline"></div>
));

jest.mock('../workstationEffects', () => mockWorkstationEffects());

const defaultProps = {
  tracks: [],
  uploadFile: jest.fn(),
};

const defaultTrack = mockTrack();

it('renders empty timeline when tracks are empty', () => {
  const { getByTestId } = render(
    <Workstation {...{ ...defaultProps, tracks: [] }} />
  );

  expect(getByTestId('empty-timeline')).toBeInTheDocument();
});

it('renders regular timeline when tracks are non-empty', () => {
  const { getByTestId } = render(
    <Workstation {...{ ...defaultProps, tracks: [defaultTrack] }} />
  );

  expect(getByTestId('regular-timeline')).toBeInTheDocument();
});

it('renders closed drawer by default', () => {
  const { container } = render(<Workstation {...defaultProps} />);

  const drawer = container.querySelector('.editor__drawer');

  expect(drawer).toHaveClass('editor__drawer--closed');
});

it('renders dropzone hidden by default', () => {
  const { container } = render(<Workstation {...defaultProps} />);

  const drawer = container.querySelector('.editor__dropzone');

  expect(drawer).toHaveClass('editor__dropzone--hidden');
});

it('uses workstation effect hooks', () => {
  render(<Workstation {...defaultProps} />);

  expect(useDropzoneDragActive).toHaveBeenCalled();
  expect(useMixerDrawerHeight).toHaveBeenCalled();
  expect(useMutedTracks).toHaveBeenCalled();
  expect(usePlaybackToggle).toHaveBeenCalled();
  expect(useSpacebarPlaybackToggle).toHaveBeenCalled();
  expect(useTransportTime).toHaveBeenCalled();
});

function mockWorkstationEffects() {
  return {
    useDropzoneDragActive: jest.fn(() => {
      return {
        isDragActive: false,
        setIsDragActive: jest.fn(),
        dropzoneRootProps: {},
        setDropzoneRootProps: jest.fn(),
      };
    }),
    useMixerDrawerHeight: jest.fn(() => {
      return {
        drawerContainerRef: { current: null },
        drawerHeight: 0,
      };
    }),
    useMutedTracks: jest.fn(),
    usePlaybackToggle: jest.fn(),
    useSpacebarPlaybackToggle: jest.fn(),
    useTransportTime: jest.fn(),
  };
}