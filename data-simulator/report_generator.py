"""
Professional PDF Report Generator for Prism Insights
Generates enterprise-grade reports with charts, AI insights, and branding
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
import json
from typing import Dict, List, Any
import numpy as np

class PrismReportGenerator:
    """Enterprise-grade PDF report generator"""
    
    # Brand colors
    PRIMARY_COLOR = colors.HexColor('#3B82F6')
    SECONDARY_COLOR = colors.HexColor('#9333EA')
    SUCCESS_COLOR = colors.HexColor('#10B981')
    WARNING_COLOR = colors.HexColor('#F59E0B')
    DANGER_COLOR = colors.HexColor('#EF4444')
    GRAY_DARK = colors.HexColor('#1F2937')
    GRAY_LIGHT = colors.HexColor('#F3F4F6')
    
    def __init__(self, output_filename: str):
        self.output_filename = output_filename
        self.doc = SimpleDocTemplate(
            output_filename,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=1*inch,
            bottomMargin=0.75*inch
        )
        self.story = []
        self.styles = self._create_styles()
        
    def _create_styles(self):
        """Create custom paragraph styles"""
        styles = getSampleStyleSheet()
        
        # Check if style exists before adding
        style_names = [s.name for s in styles.byName.values()]
        
        # Title style
        if 'CustomTitle' not in style_names:
            styles.add(ParagraphStyle(
                name='CustomTitle',
                parent=styles['Heading1'],
                fontSize=28,
                textColor=self.PRIMARY_COLOR,
                spaceAfter=6,
                alignment=TA_LEFT,
                fontName='Helvetica-Bold'
            ))
        
        # Subtitle style
        if 'CustomSubtitle' not in style_names:
            styles.add(ParagraphStyle(
                name='CustomSubtitle',
                parent=styles['Normal'],
                fontSize=12,
                textColor=self.GRAY_DARK,
                spaceAfter=20,
                alignment=TA_LEFT
            ))
        
        # Section heading
        if 'SectionHeading' not in style_names:
            styles.add(ParagraphStyle(
                name='SectionHeading',
                parent=styles['Heading2'],
                fontSize=16,
                textColor=self.GRAY_DARK,
                spaceBefore=20,
                spaceAfter=12,
                fontName='Helvetica-Bold',
                borderWidth=0,
                borderColor=self.PRIMARY_COLOR,
                borderPadding=0,
                leftIndent=0
            ))
        
        # Body text
        if 'BodyText' not in style_names:
            styles.add(ParagraphStyle(
                name='BodyText',
                parent=styles['Normal'],
                fontSize=10,
                textColor=self.GRAY_DARK,
                spaceAfter=12,
                alignment=TA_JUSTIFY,
                leading=14
            ))
        
        # Bullet points
        if 'BulletPoint' not in style_names:
            styles.add(ParagraphStyle(
                name='BulletPoint',
                parent=styles['Normal'],
                fontSize=10,
                textColor=self.GRAY_DARK,
                spaceAfter=8,
                leftIndent=20,
                bulletIndent=10,
                leading=14
            ))
        
        # Risk warning
        if 'RiskHigh' not in style_names:
            styles.add(ParagraphStyle(
                name='RiskHigh',
                parent=styles['Normal'],
                fontSize=10,
                textColor=self.DANGER_COLOR,
                spaceAfter=8,
                leftIndent=20,
                fontName='Helvetica-Bold'
            ))
        
        return styles
    
    def _add_header_footer(self, canvas_obj, doc):
        """Add header and footer to each page"""
        canvas_obj.saveState()
        
        # Header
        canvas_obj.setFillColor(self.PRIMARY_COLOR)
        canvas_obj.rect(0, letter[1] - 0.5*inch, letter[0], 0.5*inch, fill=True, stroke=False)
        
        canvas_obj.setFillColor(colors.white)
        canvas_obj.setFont('Helvetica-Bold', 14)
        canvas_obj.drawString(0.75*inch, letter[1] - 0.35*inch, "PRISM INSIGHTS")
        
        # Footer
        canvas_obj.setFillColor(self.GRAY_DARK)
        canvas_obj.setFont('Helvetica', 8)
        page_num = canvas_obj.getPageNumber()
        footer_text = f"Page {page_num} | Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}"
        canvas_obj.drawRightString(letter[0] - 0.75*inch, 0.5*inch, footer_text)
        
        canvas_obj.setFont('Helvetica', 7)
        canvas_obj.drawString(0.75*inch, 0.5*inch, "Confidential - For Internal Use Only")
        
        canvas_obj.restoreState()
    
    def add_cover_page(self, report_title: str, report_type: str, date_range: str = None):
        """Add professional cover page"""
        # Logo/Brand section
        self.story.append(Spacer(1, 1.5*inch))
        
        # Main title
        title = Paragraph(f"<b>{report_title}</b>", self.styles['CustomTitle'])
        self.story.append(title)
        self.story.append(Spacer(1, 0.1*inch))
        
        # Subtitle
        subtitle_text = f"AI-Powered Business Intelligence Report"
        subtitle = Paragraph(subtitle_text, self.styles['CustomSubtitle'])
        self.story.append(subtitle)
        self.story.append(Spacer(1, 0.3*inch))
        
        # Report metadata table
        metadata = [
            ['Report Type:', report_type],
            ['Generated:', datetime.now().strftime('%B %d, %Y')],
            ['Time:', datetime.now().strftime('%I:%M %p %Z')],
        ]
        
        if date_range:
            metadata.append(['Period:', date_range])
        
        metadata_table = Table(metadata, colWidths=[2*inch, 4*inch])
        metadata_table.setStyle(TableStyle([
            ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 10),
            ('FONT', (1, 0), (1, -1), 'Helvetica', 10),
            ('TEXTCOLOR', (0, 0), (-1, -1), self.GRAY_DARK),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        self.story.append(metadata_table)
        self.story.append(Spacer(1, 1*inch))
        
        # Disclaimer box
        disclaimer_data = [[Paragraph(
            "<b>CONFIDENTIAL INFORMATION</b><br/><br/>"
            "This report contains confidential and proprietary information generated by "
            "Prism Insights AI-powered analytics platform. The insights and recommendations "
            "provided are based on real-time data analysis using AWS Bedrock AI technology. "
            "This document is intended solely for internal business use and should not be "
            "distributed without proper authorization.",
            self.styles['BodyText']
        )]]
        
        disclaimer_table = Table(disclaimer_data, colWidths=[6*inch])
        disclaimer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), self.GRAY_LIGHT),
            ('BOX', (0, 0), (-1, -1), 2, self.PRIMARY_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 15),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
            ('LEFTPADDING', (0, 0), (-1, -1), 15),
            ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ]))
        
        self.story.append(disclaimer_table)
        self.story.append(PageBreak())
    
    def add_executive_summary(self, summary_text: str, key_metrics: List[Dict[str, Any]]):
        """Add executive summary section"""
        # Section heading
        heading = Paragraph("<b>EXECUTIVE SUMMARY</b>", self.styles['SectionHeading'])
        self.story.append(heading)
        
        # Summary text
        summary = Paragraph(summary_text, self.styles['BodyText'])
        self.story.append(summary)
        self.story.append(Spacer(1, 0.2*inch))
        
        # Key metrics table
        if key_metrics:
            metrics_data = [['METRIC', 'VALUE', 'TREND']]
            
            for metric in key_metrics:
                trend_symbol = '▲' if metric.get('trend', 0) > 0 else '▼' if metric.get('trend', 0) < 0 else '●'
                trend_color = self.SUCCESS_COLOR if metric.get('trend', 0) > 0 else self.DANGER_COLOR if metric.get('trend', 0) < 0 else self.GRAY_DARK
                
                metrics_data.append([
                    metric['label'],
                    str(metric['value']),
                    f"{trend_symbol} {abs(metric.get('trend', 0))}%"
                ])
            
            metrics_table = Table(metrics_data, colWidths=[3*inch, 2*inch, 1.5*inch])
            metrics_table.setStyle(TableStyle([
                # Header row
                ('BACKGROUND', (0, 0), (-1, 0), self.PRIMARY_COLOR),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 10),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                
                # Data rows
                ('FONT', (0, 1), (-1, -1), 'Helvetica', 9),
                ('TEXTCOLOR', (0, 1), (-1, -1), self.GRAY_DARK),
                ('ALIGN', (0, 1), (0, -1), 'LEFT'),
                ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
                
                # Styling
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, self.GRAY_LIGHT]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ]))
            
            self.story.append(metrics_table)
        
        self.story.append(Spacer(1, 0.3*inch))
    
    def add_chart(self, chart_data: Dict[str, Any], title: str):
        """Add a professional chart to the report"""
        fig, ax = plt.subplots(figsize=(7, 4))
        
        chart_type = chart_data.get('type', 'bar')
        data = chart_data.get('data', [])
        
        if chart_type == 'bar':
            labels = [item.get('name', f'Item {i}') for i, item in enumerate(data[:10])]
            values = [item.get('value', 0) for item in data[:10]]
            
            bars = ax.bar(labels, values, color='#3B82F6', alpha=0.8)
            ax.set_ylabel('Value', fontsize=10, fontweight='bold')
            ax.set_title(title, fontsize=12, fontweight='bold', pad=15)
            
            # Add value labels on bars
            for bar in bars:
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{int(height):,}',
                       ha='center', va='bottom', fontsize=8)
            
            plt.xticks(rotation=45, ha='right', fontsize=8)
            
        elif chart_type == 'line':
            for series in data:
                ax.plot(series.get('x', []), series.get('y', []), 
                       marker='o', linewidth=2, label=series.get('name', 'Series'))
            
            ax.set_title(title, fontsize=12, fontweight='bold', pad=15)
            ax.legend(fontsize=8)
            ax.grid(True, alpha=0.3)
            
        elif chart_type == 'pie':
            labels = [item.get('name', f'Item {i}') for i, item in enumerate(data[:6])]
            values = [item.get('value', 0) for item in data[:6]]
            
            colors_list = ['#3B82F6', '#9333EA', '#10B981', '#F59E0B', '#EF4444', '#6366F1']
            
            wedges, texts, autotexts = ax.pie(values, labels=labels, autopct='%1.1f%%',
                                               colors=colors_list, startangle=90)
            
            for text in texts:
                text.set_fontsize(8)
            for autotext in autotexts:
                autotext.set_color('white')
                autotext.set_fontsize(8)
                autotext.set_fontweight('bold')
            
            ax.set_title(title, fontsize=12, fontweight='bold', pad=15)
        
        plt.tight_layout()
        
        # Save chart to bytes
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        # Add to story
        img = Image(img_buffer, width=6.5*inch, height=3.7*inch)
        self.story.append(img)
        self.story.append(Spacer(1, 0.2*inch))
    
    def add_ai_insights(self, insights: Dict[str, Any]):
        """Add AI-generated insights section"""
        # Section heading
        heading = Paragraph("<b>AI-POWERED ANALYSIS & INSIGHTS</b>", self.styles['SectionHeading'])
        self.story.append(heading)
        
        # Key findings
        if insights.get('keyFindings'):
            subheading = Paragraph("<b>Key Findings:</b>", self.styles['BodyText'])
            self.story.append(subheading)
            
            for i, finding in enumerate(insights['keyFindings'], 1):
                bullet = Paragraph(f"{i}. {finding}", self.styles['BulletPoint'])
                self.story.append(bullet)
            
            self.story.append(Spacer(1, 0.2*inch))
        
        # Risk assessment
        if insights.get('risks'):
            subheading = Paragraph("<b>Risk Assessment:</b>", self.styles['BodyText'])
            self.story.append(subheading)
            
            for risk in insights['risks']:
                level = risk.get('level', 'medium').upper()
                level_color = {
                    'HIGH': self.DANGER_COLOR,
                    'MEDIUM': self.WARNING_COLOR,
                    'LOW': self.SUCCESS_COLOR
                }.get(level, self.GRAY_DARK)
                
                risk_data = [[
                    Paragraph(f"<b>{level} RISK</b>", self.styles['BodyText']),
                    Paragraph(f"<b>{risk.get('description', '')}</b><br/><br/>"
                             f"<i>Recommendation:</i> {risk.get('recommendation', '')}", 
                             self.styles['BodyText'])
                ]]
                
                risk_table = Table(risk_data, colWidths=[1*inch, 5.5*inch])
                risk_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, 0), level_color),
                    ('TEXTCOLOR', (0, 0), (0, 0), colors.white),
                    ('BACKGROUND', (1, 0), (1, 0), self.GRAY_LIGHT),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('TOPPADDING', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                    ('LEFTPADDING', (0, 0), (-1, -1), 10),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                    ('BOX', (0, 0), (-1, -1), 1, colors.grey),
                ]))
                
                self.story.append(risk_table)
                self.story.append(Spacer(1, 0.15*inch))
        
        self.story.append(Spacer(1, 0.2*inch))
    
    def add_recommendations(self, recommendations: List[str], next_actions: List[str]):
        """Add recommendations and next actions"""
        # Recommendations
        heading = Paragraph("<b>STRATEGIC RECOMMENDATIONS</b>", self.styles['SectionHeading'])
        self.story.append(heading)
        
        for i, rec in enumerate(recommendations, 1):
            bullet = Paragraph(f"{i}. {rec}", self.styles['BulletPoint'])
            self.story.append(bullet)
        
        self.story.append(Spacer(1, 0.3*inch))
        
        # Next actions
        heading = Paragraph("<b>IMMEDIATE ACTION ITEMS</b>", self.styles['SectionHeading'])
        self.story.append(heading)
        
        # Create action items table
        action_data = [['PRIORITY', 'ACTION ITEM', 'TIMELINE']]
        
        for i, action in enumerate(next_actions, 1):
            priority = 'HIGH' if i <= 2 else 'MEDIUM' if i <= 4 else 'NORMAL'
            timeline = '7 days' if i <= 2 else '14 days' if i <= 4 else '30 days'
            
            action_data.append([priority, action, timeline])
        
        action_table = Table(action_data, colWidths=[1*inch, 4.5*inch, 1*inch])
        action_table.setStyle(TableStyle([
            # Header
            ('BACKGROUND', (0, 0), (-1, 0), self.PRIMARY_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 9),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            
            # Data
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 9),
            ('ALIGN', (0, 1), (0, -1), 'CENTER'),
            ('ALIGN', (2, 1), (2, -1), 'CENTER'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, self.GRAY_LIGHT]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        self.story.append(action_table)
    
    def generate(self):
        """Generate the final PDF"""
        self.doc.build(self.story, onFirstPage=self._add_header_footer, 
                      onLaterPages=self._add_header_footer)
        print(f"Report generated successfully: {self.output_filename}")


def generate_client_profitability_report(data: Dict[str, Any], output_file: str):
    """Generate Client Profitability Intelligence Report"""
    report = PrismReportGenerator(output_file)
    
    # Cover page
    report.add_cover_page(
        "Client Profitability Intelligence Report",
        "Financial Analysis & Optimization",
        data.get('dateRange', 'Current Period')
    )
    
    # Executive summary
    report.add_executive_summary(
        data.get('summary', 'Comprehensive analysis of client profitability metrics...'),
        data.get('metrics', [])
    )
    
    # Charts
    for chart in data.get('charts', []):
        report.add_chart(chart, chart.get('title', 'Chart'))
    
    # AI insights
    report.add_ai_insights(data.get('insights', {}))
    
    # Recommendations
    report.add_recommendations(
        data.get('insights', {}).get('recommendations', []),
        data.get('insights', {}).get('nextActions', [])
    )
    
    # Generate
    report.generate()
    return output_file


def generate_software_license_report(data: Dict[str, Any], output_file: str):
    """Generate Software License Intelligence Report"""
    report = PrismReportGenerator(output_file)
    
    # Cover page
    report.add_cover_page(
        "Software License Intelligence Report",
        "License Optimization & Cost Management",
        data.get('dateRange', 'Current Period')
    )
    
    # Executive summary
    report.add_executive_summary(
        data.get('summary', 'Comprehensive analysis of software license utilization and optimization opportunities...'),
        data.get('metrics', [])
    )
    
    # Charts
    for chart in data.get('charts', []):
        report.add_chart(chart, chart.get('title', 'Chart'))
    
    # AI insights
    report.add_ai_insights(data.get('insights', {}))
    
    # Recommendations
    report.add_recommendations(
        data.get('insights', {}).get('recommendations', []),
        data.get('insights', {}).get('nextActions', [])
    )
    
    # Generate
    report.generate()
    return output_file


def generate_sales_pipeline_report(data: Dict[str, Any], output_file: str):
    """Generate Sales Pipeline Optimization Report"""
    report = PrismReportGenerator(output_file)
    
    # Cover page
    report.add_cover_page(
        "Sales Pipeline Optimization Report",
        "Revenue Forecasting & Conversion Analysis",
        data.get('dateRange', 'Current Period')
    )
    
    # Executive summary
    report.add_executive_summary(
        data.get('summary', 'Comprehensive analysis of sales pipeline performance and conversion opportunities...'),
        data.get('metrics', [])
    )
    
    # Charts
    for chart in data.get('charts', []):
        report.add_chart(chart, chart.get('title', 'Chart'))
    
    # AI insights
    report.add_ai_insights(data.get('insights', {}))
    
    # Recommendations
    report.add_recommendations(
        data.get('insights', {}).get('recommendations', []),
        data.get('insights', {}).get('nextActions', [])
    )
    
    # Generate
    report.generate()
    return output_file


if __name__ == "__main__":
    # Test report generation
    test_data = {
        'dateRange': 'January 2025',
        'summary': 'Analysis shows strong performance with opportunities for optimization.',
        'metrics': [
            {'label': 'Total MRR', 'value': '$125,000', 'trend': 8.5},
            {'label': 'Average Margin', 'value': '32.5%', 'trend': 2.3},
            {'label': 'Active Clients', 'value': '45', 'trend': 5.0},
        ],
        'charts': [
            {
                'type': 'bar',
                'title': 'Top 10 Clients by Revenue',
                'data': [
                    {'name': 'Client A', 'value': 15000},
                    {'name': 'Client B', 'value': 12000},
                    {'name': 'Client C', 'value': 10000},
                ]
            }
        ],
        'insights': {
            'keyFindings': [
                'Top 20% of clients generate 80% of revenue',
                'Average margin improved by 2.3% this quarter',
                'Three clients identified as at-risk'
            ],
            'risks': [
                {
                    'level': 'high',
                    'description': 'Three clients showing declining margins',
                    'recommendation': 'Conduct profitability review and adjust pricing'
                }
            ],
            'recommendations': [
                'Focus expansion efforts on high-margin client segments',
                'Implement quarterly profitability reviews',
                'Optimize service delivery for low-margin accounts'
            ],
            'nextActions': [
                'Schedule profitability review meetings with at-risk clients',
                'Analyze service delivery costs for bottom 20% clients',
                'Prepare pricing adjustment proposals'
            ]
        }
    }
    
    generate_client_profitability_report(test_data, 'test_report.pdf')
