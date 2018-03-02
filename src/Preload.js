'use strict';
import React from 'react';

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var ImagesPromise;
(function (ImagesPromise) {
    function libFactory(React, MockImage) {
        if (!React) {
            if (typeof require !== 'undefined') {
                React = require('react');
            }
            else {
            }
        }
        function createImageOnLoadPromise(url, key) {
            return new Promise((resolve, reject) => {
                const image = MockImage ? new MockImage() : new Image();
                image.name = key;
                image.onload = function () {
                    resolve(image);
                };
                image.onerror = function () {
                    reject(image);
                };
                image.src = url;
            });
        }
        function withImagesPromise(ImageDataSource, CompositionComponent) {
            const ImagesLoadedPromise = React.createClass({
                getInitialState() {
                    const promiseCollection = [];
                    for (const key in ImageDataSource) {
                        promiseCollection.push(createImageOnLoadPromise(ImageDataSource[key], key));
                    }
                    return {
                        promiseCollection,
                        imageData: {},
                        isLoaded: false
                    };
                },
                componentDidMount() {
                    Promise.all(this.state.promiseCollection).then((result) => {
                        const imageData = {};
                        result.map(image => {
                            imageData[image.name] = image.src;
                        });
                        this.setState({
                            imageData,
                            isLoaded: true
                        });
                    });
                },
                render() {
                    return React.createElement(CompositionComponent, __assign({images: this.state.imageData, isImagesLoaded: this.state.isLoaded}, this.props));
                }
            });
            return ImagesLoadedPromise;
        }
        return {
            createImageOnLoadPromise,
            withImagesPromise
        };
    }
    ImagesPromise.libFactory = libFactory;
    ImagesPromise.withImagesPromise = libFactory().withImagesPromise;
    ImagesPromise.createImageOnLoadPromise = libFactory().withImagesPromise;
})(ImagesPromise || (ImagesPromise = {}));
var ImagesLoaded = ImagesPromise.libFactory(React || undefined);
window.module = window.module || {};
module.exports = ImagesPromise;
