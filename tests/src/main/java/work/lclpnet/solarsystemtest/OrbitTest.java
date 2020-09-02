package work.lclpnet.solarsystemtest;

import org.knowm.xchart.XChartPanel;
import org.knowm.xchart.XYChart;
import org.knowm.xchart.XYChartBuilder;
import org.knowm.xchart.XYSeries;
import org.knowm.xchart.style.Styler;
import org.knowm.xchart.style.markers.SeriesMarkers;

import javax.swing.*;
import java.awt.*;

public class OrbitTest {

    public static void main(String[] args) {
        System.out.println("Simulating orbit...");
        simulateOrbit();
    }

    private static void simulateOrbit() {
        // 2020-Sep-01, JPL Horizons, Mars, relative to sun's center
        final double gra = 6.672E-11;
        /*final double M = 6.39E+23;
        double x = 1.379746518610276E+00, y = -1.393478644068468E-01, z = -3.676720275690865E-02;
        double vx = 1.942629911583868E-03, vy = 1.511819668505303E-02, vz = 2.691519759640370E-04;*/
        final double M = 5.97E+24;
        double x = 0, y = 6.371E+6;
        double vx = 5000, vy = 0;
        double t = 0, dt = 1;

        System.out.printf("x=%s y=%s\n", x, y);

        int it = 5000;
        double[] xData = new double[it], yData = new double[it];

        for (int i = 0; i < it; i++) {
            double r = Math.sqrt(x*x + y*y);
            double a = gra * M / r / r;
            double ax = -a * x / r, ay = -a * y / r;

            vx = vx + ax * dt;
            vy = vy + ay * dt;

            x = x + vx * dt;
            y = y + vy * dt;

            t = t + dt;

            xData[i] = x;
            yData[i] = y;

            System.out.printf("x=%s y=%s\n", x, y);
        }

        final XYChart chart = new XYChartBuilder().width(600).height(400).title("Orbit Chart").xAxisTitle("X").yAxisTitle("Y").build();
        chart.getStyler().setDefaultSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Scatter);
        chart.getStyler().setLegendPosition(Styler.LegendPosition.InsideNE);

        XYSeries marsSeries = chart.addSeries("Satellit", xData, yData);
        chart.addSeries("Erde", new int[] {0}, new int[] {0});

        javax.swing.SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Test");
            frame.setLayout(new BorderLayout());
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

            JPanel chartPanel = new XChartPanel<XYChart>(chart);
            frame.add(chartPanel, BorderLayout.CENTER);

            frame.pack();
            frame.setVisible(true);
        });
    }

}
