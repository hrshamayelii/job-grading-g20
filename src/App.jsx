import React, { useState, useEffect } from 'react';

// Define scoring tables from the G20 document - REBUILT based on new Level/Sub-level structure
const factorScores = {
    'knowledge': {
        1: { 1: { 1: 128, 2: 134, 3: 141 }, 2: { 1: 148, 2: 155, 3: 163 }, 3: { 1: 171, 2: 179, 3: 187 } },
        2: { 1: { 1: 196, 2: 205, 3: 215 }, 2: { 1: 225, 2: 236, 3: 247 }, 3: { 1: 259, 2: 271, 3: 284 } },
        3: { 1: { 1: 298, 2: 312, 3: 327 }, 2: { 1: 343, 2: 359, 3: 376 }, 3: { 1: 395, 2: 413, 3: 432 } },
        4: { 1: { 1: 452, 2: 473, 3: 497 }, 2: { 1: 526, 2: 550, 3: 572 }, 3: { 1: 599, 2: 627, 3: 658 } },
        5: { 1: { 1: 689, 2: 721, 3: 756 }, 2: { 1: 801, 2: 838, 3: 870 }, 3: { 1: 920, 2: 963, 3: 1000 } }
    },
    'experience': {
        1: { 1: { 1: 128, 2: 134, 3: 141 }, 2: { 1: 148, 2: 155, 3: 163 }, 3: { 1: 171, 2: 179, 3: 187 } },
        2: { 1: { 1: 196, 2: 205, 3: 215 }, 2: { 1: 225, 2: 236, 3: 247 }, 3: { 1: 259, 2: 271, 3: 284 } },
        3: { 1: { 1: 298, 2: 312, 3: 327 }, 2: { 1: 343, 2: 359, 3: 376 }, 3: { 1: 395, 2: 413, 3: 432 } },
        4: { 1: { 1: 452, 2: 473, 3: 497 }, 2: { 1: 526, 2: 550, 3: 572 }, 3: { 1: 599, 2: 627, 3: 658 } },
        5: { 1: { 1: 689, 2: 721, 3: 756 }, 2: { 1: 801, 2: 838, 3: 870 }, 3: { 1: 920, 2: 963, 3: 1000 } }
    },
    'skills': {
        1: { 1: { 1: 103, 2: 108, 3: 113 }, 2: { 1: 119, 2: 124, 3: 130 }, 3: { 1: 136, 2: 143, 3: 150 } },
        2: { 1: { 1: 157, 2: 164, 3: 172 }, 2: { 1: 180, 2: 189, 3: 198 }, 3: { 1: 207, 2: 217, 3: 227 } },
        3: { 1: { 1: 238, 2: 249, 3: 262 }, 2: { 1: 275, 2: 287, 3: 301 }, 3: { 1: 316, 2: 330, 3: 346 } },
        4: { 1: { 1: 362, 2: 378, 3: 398 }, 2: { 1: 421, 2: 440, 3: 457 }, 3: { 1: 479, 2: 501, 3: 526 } },
        5: { 1: { 1: 551, 2: 577, 3: 605 }, 2: { 1: 640, 2: 670, 3: 696 }, 3: { 1: 736, 2: 770, 3: 800 } }
    },
    'hr_responsibility': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'financial_responsibility': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'physical_resources_responsibility': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'reports_responsibility': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'communication_responsibility': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'regulations_responsibility': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'hsee_responsibility': {
        1: { 1: { 1: 25, 2: 26, 3: 28 }, 2: { 1: 29, 2: 31, 3: 32 }, 3: { 1: 35, 2: 36, 3: 37 } },
        2: { 1: { 1: 39, 2: 41, 3: 43 }, 2: { 1: 45, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 57 } },
        3: { 1: { 1: 59, 2: 62, 3: 65 }, 2: { 1: 69, 2: 72, 3: 75 }, 3: { 1: 79, 2: 83, 3: 86 } },
        4: { 1: { 1: 91, 2: 95, 3: 99 }, 2: { 1: 105, 2: 110, 3: 114 }, 3: { 1: 120, 2: 125, 3: 131 } },
        5: { 1: { 1: 138, 2: 145, 3: 151 }, 2: { 1: 160, 2: 167, 3: 173 }, 3: { 1: 184, 2: 192, 3: 200 } }
    },
    'autonomy': {
        1: { 1: { 1: 128, 2: 134, 3: 141 }, 2: { 1: 148, 2: 155, 3: 163 }, 3: { 1: 171, 2: 179, 3: 187 } },
        2: { 1: { 1: 196, 2: 205, 3: 215 }, 2: { 1: 225, 2: 236, 3: 247 }, 3: { 1: 259, 2: 271, 3: 284 } },
        3: { 1: { 1: 298, 2: 312, 3: 327 }, 2: { 1: 343, 2: 359, 3: 376 }, 3: { 1: 395, 2: 413, 3: 432 } },
        4: { 1: { 1: 452, 2: 473, 3: 497 }, 2: { 1: 526, 2: 550, 3: 572 }, 3: { 1: 599, 2: 627, 3: 658 } },
        5: { 1: { 1: 689, 2: 721, 3: 756 }, 2: { 1: 801, 2: 838, 3: 870 }, 3: { 1: 920, 2: 963, 3: 1000 } }
    },
    'problem_solving_creativity': {
        1: { 1: { 1: 128, 2: 134, 3: 141 }, 2: { 1: 148, 2: 155, 3: 163 }, 3: { 1: 171, 2: 179, 3: 187 } },
        2: { 1: { 1: 196, 2: 205, 3: 215 }, 2: { 1: 225, 2: 236, 3: 247 }, 3: { 1: 259, 2: 271, 3: 284 } },
        3: { 1: { 1: 298, 2: 312, 3: 327 }, 2: { 1: 343, 2: 359, 3: 376 }, 3: { 1: 395, 2: 413, 3: 432 } },
        4: { 1: { 1: 452, 2: 473, 3: 497 }, 2: { 1: 526, 2: 550, 3: 572 }, 3: { 1: 599, 2: 627, 3: 658 } },
        5: { 1: { 1: 689, 2: 721, 3: 756 }, 2: { 1: 801, 2: 838, 3: 870 }, 3: { 1: 920, 2: 963, 3: 1000 } }
    },
    'accountability': {
        1: { 1: { 1: 128, 2: 134, 3: 141 }, 2: { 1: 148, 2: 155, 3: 163 }, 3: { 1: 171, 2: 179, 3: 187 } },
        2: { 1: { 1: 196, 2: 205, 3: 215 }, 2: { 1: 225, 2: 236, 3: 247 }, 3: { 1: 259, 2: 271, 3: 284 } },
        3: { 1: { 1: 298, 2: 312, 3: 327 }, 2: { 1: 343, 2: 359, 3: 376 }, 3: { 1: 395, 2: 413, 3: 432 } },
        4: { 1: { 1: 452, 2: 473, 3: 497 }, 2: { 1: 526, 2: 550, 3: 572 }, 3: { 1: 599, 2: 627, 3: 658 } },
        5: { 1: { 1: 689, 2: 721, 3: 756 }, 2: { 1: 801, 2: 838, 3: 870 }, 3: { 1: 920, 2: 963, 3: 1000 } }
    },
    'special_responsibility': {
        1: { 1: { 1: 13, 2: 14, 3: 14 }, 2: { 1: 15, 2: 15, 3: 16 }, 3: { 1: 17, 2: 18, 3: 18 } },
        2: { 1: { 1: 19, 2: 20, 3: 21 }, 2: { 1: 22, 2: 23, 3: 24 }, 3: { 1: 26, 2: 27, 3: 28 } },
        3: { 1: { 1: 29, 2: 31, 3: 33 }, 2: { 1: 35, 2: 36, 3: 38 }, 3: { 1: 40, 2: 41, 3: 43 } },
        4: { 1: { 1: 45, 2: 47, 3: 50 }, 2: { 1: 53, 2: 55, 3: 57 }, 3: { 1: 60, 2: 63, 3: 66 } },
        5: { 1: { 1: 69, 2: 72, 3: 75 }, 2: { 1: 80, 2: 84, 3: 87 }, 3: { 1: 92, 2: 96, 3: 100 } }
    },
    'intellectual_effort': {
        1: { 1: { 1: 76, 2: 80, 3: 84 }, 2: { 1: 88, 2: 93, 3: 98 }, 3: { 1: 103, 2: 108, 3: 112 } },
        2: { 1: { 1: 118, 2: 123, 3: 128 }, 2: { 1: 134, 2: 141, 3: 148 }, 3: { 1: 158, 2: 165, 3: 170 } },
        3: { 1: { 1: 178, 2: 186, 3: 196 }, 2: { 1: 208, 2: 218, 3: 226 }, 3: { 1: 237, 2: 248, 3: 260 } },
        4: { 1: { 1: 272, 2: 284, 3: 298 }, 2: { 1: 315, 2: 329, 3: 344 }, 3: { 1: 358, 2: 375, 3: 394 } },
        5: { 1: { 1: 413, 2: 432, 3: 454 }, 2: { 1: 480, 2: 502, 3: 522 }, 3: { 1: 552, 2: 578, 3: 600 } }
    },
    'emotional_effort': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'physical_effort': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'work_hazards': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'unfavorable_conditions': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
    'stress_unusual_conditions': {
        1: { 1: { 1: 38, 2: 40, 3: 42 }, 2: { 1: 44, 2: 47, 3: 49 }, 3: { 1: 52, 2: 54, 3: 56 } },
        2: { 1: { 1: 59, 2: 62, 3: 64 }, 2: { 1: 67, 2: 71, 3: 74 }, 3: { 1: 78, 2: 81, 3: 85 } },
        3: { 1: { 1: 89, 2: 94, 3: 98 }, 2: { 1: 103, 2: 108, 3: 113 }, 3: { 1: 119, 2: 124, 3: 130 } },
        4: { 1: { 1: 136, 2: 142, 3: 149 }, 2: { 1: 157, 2: 164, 3: 172 }, 3: { 1: 180, 2: 188, 3: 197 } },
        5: { 1: { 1: 207, 2: 217, 3: 227 }, 2: { 1: 240, 2: 251, 3: 261 }, 3: { 1: 276, 2: 289, 3: 300 } }
    },
};

// Grade mapping from Table 24
const gradeRanges = [
  { grade: '1', min: 3000, max: 3100 }, { grade: '2', min: 3101, max: 3255 }, { grade: '3', min: 3256, max: 3418 },
  { grade: '4', min: 3419, max: 3589 }, { grade: '5', min: 3590, max: 3768 }, { grade: '6', min: 3769, max: 3956 },
  { grade: '7', min: 3957, max: 4154 }, { grade: '8', min: 4155, max: 4362 }, { grade: '9', min: 4363, max: 4580 },
  { grade: '10', min: 4581, max: 4809 }, { grade: '11', min: 4810, max: 5050 }, { grade: '12', min: 5051, max: 5302 },
  { grade: '13', min: 5303, max: 5567 }, { grade: '14', min: 5568, max: 5846 }, { grade: '15', min: 5847, max: 6138 },
  { grade: '16', min: 6139, max: 6445 }, { grade: '17', min: 6446, max: 6767 }, { grade: '18', min: 6768, max: 7105 },
  { grade: '19', min: 7106, max: 7461 }, { grade: '20', min: 7462, max: 7834 }, { grade: '21 (A)', min: 7835, max: 8225 },
  { grade: '22 (B)', min: 8226, max: 8636 }, { grade: '23 (C)', min: 8637, max: 9068 }, { grade: '24 (D)', min: 9069, max: 9522 },
  { grade: '25 (E)', min: 9523, max: 10000 },
];

const factorDefinitions = {
  'knowledge': { name: 'دانش مورد نیاز شغل', maxScore: 1000, category: 'intellectual' },
  'experience': { name: 'حوزه‌های تجربی شغل', maxScore: 1000, category: 'intellectual' },
  'skills': { name: 'مهارت‌های مورد نیاز شغل', maxScore: 800, category: 'intellectual' },
  'hr_responsibility': { name: 'مسئولیت منابع انسانی', maxScore: 300, category: 'managerial' },
  'financial_responsibility': { name: 'مسئولیت منابع مالی', maxScore: 300, category: 'managerial' },
  'physical_resources_responsibility': { name: 'مسئولیت منابع فیزیکی', maxScore: 300, category: 'routine' },
  'reports_responsibility': { name: 'مسئولیت فرم‌ها و گزارشات', maxScore: 300, category: 'managerial' },
  'communication_responsibility': { name: 'مسئولیت تماس و ارتباط با درون و بیرون سازمان', maxScore: 300, category: 'managerial' },
  'regulations_responsibility': { name: 'مسئولیت مقررات، روش‌ها و سیستم‌ها و استانداردها', maxScore: 300, category: 'managerial' },
  'hsee_responsibility': { name: 'مسئولیت بهداشت روانشناختی، محیط داخلی و ارگونومی', maxScore: 200, category: 'routine' },
  'autonomy': { name: 'استقلال و آزادی عمل در تصمیم‌گیری', maxScore: 1000, category: 'strategic' },
  'problem_solving_creativity': { name: 'حل مسئله و خلاقیت', maxScore: 1000, category: 'strategic' },
  'accountability': { name: 'پاسخگویی در برابر پیامدهای تصمیمات', maxScore: 1000, category: 'strategic' },
  'special_responsibility': { name: 'مسئولیت خاص', maxScore: 100, category: 'managerial' },
  'intellectual_effort': { name: 'کوشش فکری، دقت و تمرکز حواس', maxScore: 600, category: 'intellectual' },
  'emotional_effort': { name: 'کوشش احساسی', maxScore: 300, category: 'intellectual' },
  'physical_effort': { name: 'کوشش جسمانی', maxScore: 300, category: 'physical' },
  'work_hazards': { name: 'خطرات ناشی از کار و سطح ریسک', maxScore: 300, category: 'environmental' },
  'unfavorable_conditions': { name: 'شرایط نامساعد محیط کار', maxScore: 300, category: 'environmental' },
  'stress_unusual_conditions': { name: 'استرس و سایر شرایط غیرعادی کار', maxScore: 300, category: 'environmental' },
};

// Categories for consistency check (based on Table 25 logic)
const intellectualStrategicFactors = [
  'knowledge', 'experience', 'skills', 'hr_responsibility', 'financial_responsibility',
  'reports_responsibility', 'communication_responsibility', 'regulations_responsibility',
  'autonomy', 'problem_solving_creativity', 'accountability', 'special_responsibility',
  'intellectual_effort', 'emotional_effort'
];
const physicalEnvironmentalRoutineFactors = [
  'physical_resources_responsibility', 'hsee_responsibility', 'physical_effort',
  'work_hazards', 'unfavorable_conditions', 'stress_unusual_conditions'
];

const App = () => {
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobInfo, setJobInfo] = useState({
    title: '',
    unit: '',
    supervisor: '',
    objective: '',
  });

  const [factorInputs, setFactorInputs] = useState(() => {
    const initialInputs = {};
    for (const key in factorDefinitions) {
      initialInputs[key] = {
        level: '',
        sublevel: '',
        frequency: '',
        justification: '',
        score: 0,
      };
    }
    return initialInputs;
  });

  const [totalScore, setTotalScore] = useState(0);
  const [jobGrade, setJobGrade] = useState('');
  const [consistencyWarnings, setConsistencyWarnings] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiRetrievalError, setAiRetrievalError] = useState('');

  const sublevelOptions = { 1: 'پایه', 2: 'میانی', 3: 'نهایی' };

  const handleChangeJobInfo = (e) => {
    const { name, value } = e.target;
    setJobInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeFactorInput = (factorKey, type, value) => {
    setFactorInputs(prev => ({
      ...prev,
      [factorKey]: {
        ...prev[factorKey],
        [type]: value,
      },
    }));
  };

  const calculateFactorScore = (factorKey, level, sublevel, frequency) => {
    if (factorScores[factorKey]?.[level]?.[sublevel]?.[frequency]) {
        return Math.round(factorScores[factorKey][level][sublevel][frequency]);
    }
    return 0;
  };

  const fetchJobInfoFromAI = async () => {
    setIsLoading(true);
    setAiRetrievalError('');
    setShowResults(false);

    if (!jobTitleInput.trim()) {
      setAiRetrievalError('لطفاً عنوان شغل را وارد کنید.');
      setIsLoading(false);
      return;
    }

    try {
      const extractionPrompt = `Please provide the job description details including title, unit, supervisor, objective, and detailed evaluation for 20 job grading factors for the job "${jobTitleInput}". For each factor, infer the main level (1-5), the sub-level (1 for 'min/base', 2 for 'mid', 3 for 'max/final'), and frequency (1-3) based on typical responsibilities and provide a concise justification. All justifications and text should be in Persian.
      
      Output JSON format:
      {
        "jobInfo": { "title": "string", "unit": "string", "supervisor": "string", "objective": "string" },
        "factorInputs": {
          "knowledge": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "experience": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "skills": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "hr_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "financial_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "physical_resources_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "reports_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "communication_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "regulations_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "hsee_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "autonomy": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "problem_solving_creativity": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "accountability": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "special_responsibility": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "intellectual_effort": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "emotional_effort": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "physical_effort": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "work_hazards": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "unfavorable_conditions": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" },
          "stress_unusual_conditions": { "level": "string", "sublevel": "string", "frequency": "string", "justification": "string" }
        }
      }`;

      const extractionPayload = {
        contents: [{ role: "user", parts: [{ text: extractionPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "jobInfo": { type: "OBJECT", properties: { "title": { "type": "STRING" }, "unit": { "type": "STRING" }, "supervisor": { "type": "STRING" }, "objective": { "type": "STRING" } } },
              "factorInputs": {
                type: "OBJECT",
                properties: Object.fromEntries(
                  Object.keys(factorDefinitions).map(key => [
                    key,
                    { type: "OBJECT", properties: { "level": { "type": "STRING" }, "sublevel": { "type": "STRING" }, "frequency": { "type": "STRING" }, "justification": { "type": "STRING" } } }
                  ])
                )
              }
            }
          }
        }
      };

      const apiKey = ""; // Canvas will provide this
      const extractionApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const extractionResponse = await fetch(extractionApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractionPayload)
      });
      const extractionResult = await extractionResponse.json();

      if (extractionResult.candidates?.[0]?.content?.parts?.[0]) {
        const jsonText = extractionResult.candidates[0].content.parts[0].text;
        const parsedData = JSON.parse(jsonText);
        setJobInfo(parsedData.jobInfo);
        
        setFactorInputs(prevInputs => {
            const newInputs = JSON.parse(JSON.stringify(prevInputs)); // Deep copy to ensure no mutation
            for (const key in parsedData.factorInputs) {
                if (newInputs[key]) { 
                    const aiData = parsedData.factorInputs[key];
                    newInputs[key] = {
                        ...newInputs[key], 
                        level: String(aiData.level || ''),
                        sublevel: String(aiData.sublevel || ''),
                        frequency: String(aiData.frequency || ''),
                        justification: aiData.justification || '',
                    };
                }
            }
            return newInputs;
        });

      } else {
        throw new Error('Failed to extract structured job information from AI.');
      }

    } catch (error) {
      console.error("Error fetching job info from AI:", error);
      setAiRetrievalError('خطا در دریافت اطلاعات شغل از هوش مصنوعی. لطفاً عنوان شغل را دقیق‌تر وارد کنید یا بعداً امتحان کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const performCalculations = () => {
    const newErrors = {};
    let allInputsValid = true;

    for (const key in factorInputs) {
      if (!factorInputs[key].level || !factorInputs[key].sublevel || !factorInputs[key].frequency || !factorInputs[key].justification) {
        newErrors[key] = 'تمام فیلدهای سطح اصلی، زیرسطح، فراوانی و توجیه باید پر شوند.';
        allInputsValid = false;
      }
    }

    if (!jobInfo.title || !jobInfo.unit || !jobInfo.supervisor || !jobInfo.objective) {
      newErrors.jobInfo = 'تمام فیلدهای مشخصات کلی شغل باید پر شوند.';
      allInputsValid = false;
    }

    setErrors(newErrors);

    if (!allInputsValid) {
      setShowResults(false);
      return;
    }

    let currentTotalScore = 0;
    const updatedFactorInputs = JSON.parse(JSON.stringify(factorInputs));

    for (const key in updatedFactorInputs) {
      const score = calculateFactorScore(
        key,
        parseInt(updatedFactorInputs[key].level),
        parseInt(updatedFactorInputs[key].sublevel),
        parseInt(updatedFactorInputs[key].frequency)
      );
      updatedFactorInputs[key].score = score;
      currentTotalScore += score;
    }

    setFactorInputs(updatedFactorInputs);
    setTotalScore(currentTotalScore);
    determineJobGrade(currentTotalScore);
    performConsistencyCheck(updatedFactorInputs);
    setShowResults(true);
  };

  const determineJobGrade = (score) => {
    for (const range of gradeRanges) {
      if (score >= range.min && score <= range.max) {
        setJobGrade(range.grade);
        return;
      }
    }
    setJobGrade('نامشخص');
  };

  const performConsistencyCheck = (currentFactorInputs) => {
    const warnings = [];
    let highIntellectualStrategic = false;
    let highPhysicalEnvironmentalRoutine = false;

    for (const factorKey of intellectualStrategicFactors) {
      if (currentFactorInputs[factorKey].level === '5' && currentFactorInputs[factorKey].sublevel === '3' && currentFactorInputs[factorKey].frequency === '3') {
        highIntellectualStrategic = true;
      }
    }

    for (const factorKey of physicalEnvironmentalRoutineFactors) {
      if (currentFactorInputs[factorKey].level === '5' && currentFactorInputs[factorKey].sublevel === '3' && currentFactorInputs[factorKey].frequency === '3') {
        highPhysicalEnvironmentalRoutine = true;
      }
    }

    if (highIntellectualStrategic && highPhysicalEnvironmentalRoutine) {
      warnings.push({
        type: 'Severe',
        message: 'ناسازگاری شدید: یک شغل نمی‌تواند همزمان نیاز به دانش و پیچیدگی بسیار بالا و همچنین کوشش جسمانی/محیطی بسیار سنگین و مداوم داشته باشد. لطفاً ارزیابی خود را بازبینی کنید.',
      });
    } else {
      let moderateIntellectualStrategic = false;
      let moderatePhysicalEnvironmentalRoutine = false;

      for (const factorKey of intellectualStrategicFactors) {
        const level = parseInt(currentFactorInputs[factorKey].level);
        const sublevel = parseInt(currentFactorInputs[factorKey].sublevel);
        const frequency = parseInt(currentFactorInputs[factorKey].frequency);
        if ((level >= 4) && (sublevel >= 2) && (frequency >= 2)) {
          moderateIntellectualStrategic = true;
        }
      }

      for (const factorKey of physicalEnvironmentalRoutineFactors) {
        const level = parseInt(currentFactorInputs[factorKey].level);
        const sublevel = parseInt(currentFactorInputs[factorKey].sublevel);
        const frequency = parseInt(currentFactorInputs[factorKey].frequency);
        if ((level >= 4) && (sublevel >= 2) && (frequency >= 2)) {
          moderatePhysicalEnvironmentalRoutine = true;
        }
      }

      if (moderateIntellectualStrategic && moderatePhysicalEnvironmentalRoutine) {
        warnings.push({
          type: 'Moderate',
          message: 'ناسازگاری متوسط: به نظر می‌رسد شغل همزمان دارای الزامات فکری/استراتژیک و جسمانی/محیطی بالایی است. توصیه می‌شود ارزیابی خود را با دقت بیشتری بازبینی کنید.',
        });
      }
    }
    setConsistencyWarnings(warnings);
  };

  const renderFactorInput = (factorKey) => {
    const factorInput = factorInputs[factorKey];
    const definition = factorDefinitions[factorKey];

    // **FIX:** Add a guard clause to prevent rendering if data is not available yet.
    if (!factorInput || !definition) {
        return null;
    }

    const maxScore = definition.maxScore;
    const currentScore = factorInput.score;
    const error = errors[factorKey];

    return (
      <div key={factorKey} className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{definition.name} (حداکثر {maxScore} امتیاز)</h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              سطح اصلی (1-5):
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              value={factorInput.level}
              onChange={(e) => handleChangeFactorInput(factorKey, 'level', e.target.value)}
            >
              <option value="">انتخاب کنید</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
           <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              زیرسطح:
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              value={factorInput.sublevel}
              onChange={(e) => handleChangeFactorInput(factorKey, 'sublevel', e.target.value)}
            >
              <option value="">انتخاب کنید</option>
              {Object.entries(sublevelOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              سطح فراوانی (1-3):
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-red-500' : ''}`}
              value={factorInput.frequency}
              onChange={(e) => handleChangeFactorInput(factorKey, 'frequency', e.target.value)}
            >
              <option value="">انتخاب کنید</option>
              {[1, 2, 3].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-lg font-bold text-blue-600">امتیاز: {currentScore}</p>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            توضیح مستدل:
          </label>
          <textarea
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 ${error ? 'border-red-500' : ''}`}
            value={factorInput.justification}
            onChange={(e) => handleChangeFactorInput(factorKey, 'justification', e.target.value)}
            placeholder="توضیح دهید چرا این سطوح را انتخاب کرده‌اید..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
          سیستم گریدبندی شغل (مدل G20)
        </h1>

        <div className="bg-blue-50 p-6 rounded-xl shadow-inner mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">دریافت اطلاعات شغل از هوش مصنوعی</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                عنوان شغل را وارد کنید:
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                placeholder="مثال: مدیر طرح و برنامه"
              />
            </div>
            <button
              onClick={fetchJobInfoFromAI}
              className="mt-6 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 flex items-center justify-center"
              disabled={isLoading || !jobTitleInput.trim()}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'دریافت اطلاعات شغل از هوش مصنوعی'
              )}
            </button>
          </div>
          {aiRetrievalError && <p className="text-red-500 text-sm mt-4">{aiRetrievalError}</p>}
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl shadow-inner mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">الف. مشخصات کلی شغل</h2>
          {errors.jobInfo && <p className="text-red-500 text-sm mb-4">{errors.jobInfo}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                عنوان شغل:
              </label>
              <input type="text" name="title" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={jobInfo.title} onChange={handleChangeJobInfo} disabled={isLoading} />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                واحد سازمانی:
              </label>
              <input type="text" name="unit" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={jobInfo.unit} onChange={handleChangeJobInfo} disabled={isLoading} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                شغل مافوق:
              </label>
              <input type="text" name="supervisor" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={jobInfo.supervisor} onChange={handleChangeJobInfo} disabled={isLoading} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                هدف کلی شغل:
              </label>
              <textarea name="objective" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" value={jobInfo.objective} onChange={handleChangeJobInfo} disabled={isLoading} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-indigo-700 mb-6">ب. ارزیابی عوامل شغل</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">1. الزامات دانشی</h3>
        {renderFactorInput('knowledge')}
        {renderFactorInput('experience')}
        {renderFactorInput('skills')}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">2. اختیارات و مسئولیت‌ها</h3>
        {renderFactorInput('hr_responsibility')}
        {renderFactorInput('financial_responsibility')}
        {renderFactorInput('physical_resources_responsibility')}
        {renderFactorInput('reports_responsibility')}
        {renderFactorInput('communication_responsibility')}
        {renderFactorInput('regulations_responsibility')}
        {renderFactorInput('hsee_responsibility')}
        {renderFactorInput('autonomy')}
        {renderFactorInput('problem_solving_creativity')}
        {renderFactorInput('accountability')}
        {renderFactorInput('special_responsibility')}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">3. کوشش‌ها</h3>
        {renderFactorInput('intellectual_effort')}
        {renderFactorInput('emotional_effort')}
        {renderFactorInput('physical_effort')}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">4. شرایط کار</h3>
        {renderFactorInput('work_hazards')}
        {renderFactorInput('unfavorable_conditions')}
        {renderFactorInput('stress_unusual_conditions')}

        <div className="flex justify-center mt-10">
          <button onClick={performCalculations} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105" disabled={isLoading}>
            محاسبه گرید شغل
          </button>
        </div>

        {showResults && (
          <div className="mt-12 bg-green-50 p-8 rounded-2xl shadow-xl border-2 border-green-300">
            <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">نتایج ارزیابی گرید شغلی</h2>
            {consistencyWarnings.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                <p className="font-bold">هشدارهای ناسازگاری:</p>
                <ul className="list-disc list-inside">
                  {consistencyWarnings.map((warning, index) => (
                    <li key={index} className={warning.type === 'Severe' ? 'text-red-600' : ''}>{warning.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-center mb-6">
              <p className="text-xl font-semibold text-gray-700">امتیاز کل شغل:</p>
              <p className="text-5xl font-extrabold text-indigo-700 mt-2">{totalScore}</p>
              <p className="text-xl font-semibold text-gray-700 mt-4">گرید شغلی تعیین شده:</p>
              <p className="text-5xl font-extrabold text-indigo-700 mt-2">{jobGrade}</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">خلاصه امتیازات عوامل اصلی:</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-800 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left rounded-tl-lg">عامل اصلی</th>
                    <th className="py-3 px-6 text-center">حداکثر امتیاز</th>
                    <th className="py-3 px-6 text-center rounded-tr-lg">امتیاز کسب شده</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">الف ـ الزامات دانشی</td>
                    <td className="py-3 px-6 text-center">2800</td>
                    <td className="py-3 px-6 text-center">{(factorInputs.knowledge.score || 0) + (factorInputs.experience.score || 0) + (factorInputs.skills.score || 0)}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">ب ـ اختیارات و مسئولیت‌ها</td>
                    <td className="py-3 px-6 text-center">5100</td>
                    <td className="py-3 px-6 text-center">{(factorInputs.hr_responsibility.score || 0) + (factorInputs.financial_responsibility.score || 0) + (factorInputs.physical_resources_responsibility.score || 0) + (factorInputs.reports_responsibility.score || 0) + (factorInputs.communication_responsibility.score || 0) + (factorInputs.regulations_responsibility.score || 0) + (factorInputs.hsee_responsibility.score || 0) + (factorInputs.autonomy.score || 0) + (factorInputs.problem_solving_creativity.score || 0) + (factorInputs.accountability.score || 0) + (factorInputs.special_responsibility.score || 0)}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">ج ـ کوشش‌ها</td>
                    <td className="py-3 px-6 text-center">1200</td>
                    <td className="py-3 px-6 text-center">{(factorInputs.intellectual_effort.score || 0) + (factorInputs.emotional_effort.score || 0) + (factorInputs.physical_effort.score || 0)}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">د ـ شرایط کار</td>
                    <td className="py-3 px-6 text-center">900</td>
                    <td className="py-3 px-6 text-center">{(factorInputs.work_hazards.score || 0) + (factorInputs.unfavorable_conditions.score || 0) + (factorInputs.stress_unusual_conditions.score || 0)}</td>
                  </tr>
                  <tr className="bg-indigo-50 font-bold text-indigo-900">
                    <td className="py-3 px-6 text-left rounded-bl-lg">جمع کل</td>
                    <td className="py-3 px-6 text-center">10000</td>
                    <td className="py-3 px-6 text-center rounded-br-lg">{totalScore}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">جزئیات امتیازات هر عامل:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(factorDefinitions).map(factorKey => {
                const factorInput = factorInputs[factorKey];
                if (!factorInput) return null;
                return (
                    <div key={factorKey} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="font-semibold text-gray-800">{factorDefinitions[factorKey].name}:</p>
                        <p className="text-gray-600">امتیاز: {factorInput.score}</p>
                        <p className="text-gray-600">سطح اصلی: {factorInput.level}</p>
                        <p className="text-gray-600">زیرسطح: {sublevelOptions[factorInput.sublevel]}</p>
                        <p className="text-gray-600">فراوانی: {factorInput.frequency}</p>
                        <p className="text-gray-600 text-sm italic">توجیه: {factorInput.justification}</p>
                    </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;